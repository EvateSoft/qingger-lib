/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 15:53
 */
import {BaseAuthType, BaseHttpRequestOption, BaseHttpRequestParams, HttpMethod} from "./baseHttpClientType";
import {ItemObject,FunctionRetPromise} from "../common/types";
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {QinggerLibUtils} from "../utils/functions";
import {QinggerLibURL} from "../utils/urlUtil";

const _ = require("lodash");
const format = require("string-template");
const axios = require('axios');
const https = require('https');
const http = require("http");

/**
 * HTTP通信基础类(基于Axios)
 */
export namespace QinggerHttpClient {

    import isset = QinggerLibUtils.isset;
    import empty = QinggerLibUtils.empty;
    import urlUtil = QinggerLibURL.urlUtil;
    export const ERR_DATA_TOKEN_NOT_VALID = 20400;
    export const ERR_HTTP_REQUEST_ERROR = 20500;
    export const ERR_HTTP_REQUEST_TIMEOUT  = 20504;
    export const ERR_HTTP_REQUEST_ABORT_TIMEOUT = 20505;

    /**
     * HTTP连接类
     */
    export class HttpClient {

        /** HTTP请求的选项配置 */
        protected baseHttpRequestOptions : BaseHttpRequestOption;

        /** 头部结构信息 */
        protected headers : ItemObject;

        /** 认证类型 */
        protected authType : BaseAuthType = BaseAuthType.NONE;

        protected method = HttpMethod.GET;

        protected baseURL = '';
        protected urlPath = '/';
        protected postParams = {};
        protected queryParams = {};
        protected timeout = 5000;
        protected timeoutRetryTimes = 3;

        protected requestName = '';

        /**
         * HTTPS-Agent
         */
        protected httpsAgent = null;

        /**
         * HTTP-Agent
         */
        protected httpAgent = null;

        /* 以下两个设置后可以返回数据流 (arraybuffer/binary)*/
        protected responseType = '';
        protected responseEncoding = '';

        constructor(requestOptions:BaseHttpRequestOption=null) {
            let defaultRequestConfig : BaseHttpRequestOption = requestOptions || {
                name:'defaultName',
                method : "GET",
                baseURL : '',
                path : '/',
                auth : false,
                headers : {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            this.initRequestConfig(defaultRequestConfig);
        }

        /**
         * 获取请求
         * @return ItemObject
         */
        public getHttpClientRequestData() {
            return {
                requestName : this.requestName,
                requestOptions : this.baseHttpRequestOptions,
                postParams : this.postParams,
                queryParams : this.queryParams,
                baseURL : this.baseURL,
                urlPath : this.urlPath,
                authType : this.authType,
                headers : this.headers
            }
        }

        /**
         * 将HTTP的response返回数据中data字段返回回去
         * @param {AxiosResponse} response
         * @return {any}
         * @constructor
         */
        public static ResolveHttpResponse(response:AxiosResponse) {
            return response && response.data;
        }

        /**
         * 检查HTTP Response 状态值
         * 状态值在200~400间为正常
         * @param {AxiosResponse} response
         * @return {AxiosResponse | boolean}
         */
        public static CheckHttpResponseStatus(response:AxiosResponse) {
            return response && response.status>=200 && response.status<400;
        }


        /**
         * 对于请求选项进行初始化
         * @param {BaseHttpRequestOption} options
         * @return {QinggerHttpClient.HttpClient}
         */
        public initRequestConfig(options:BaseHttpRequestOption) {
            this.clearAllParams();
            this.baseHttpRequestOptions = options;
            this.method     = _.defaultTo(this.baseHttpRequestOptions.method,"GET");
            this.baseURL    = _.defaultTo(this.baseHttpRequestOptions.baseURL,"");
            this.urlPath    = _.defaultTo(this.baseHttpRequestOptions.path,"/");
            this.authType   = _.defaultTo(this.baseHttpRequestOptions.authType,BaseAuthType.NONE);
            this.headers    =  _.defaultTo(this.baseHttpRequestOptions.headers,{});
            this.timeout    = _.defaultTo(this.baseHttpRequestOptions.timeout,5000);
            this.requestName= _.defaultTo(this.baseHttpRequestOptions.name,'');
            this.responseType = _.defaultTo(this.baseHttpRequestOptions.responseType,'');
            this.responseEncoding = _.defaultTo(this.baseHttpRequestOptions.responseEncoding,'');
            this.timeoutRetryTimes = _.defaultTo(this.baseHttpRequestOptions.timeoutTryTimes,3);

            // 必须初始化(否则会沿用老的)
            this.httpAgent = this.httpsAgent = null;

            if (this.baseHttpRequestOptions.optionItems && this.baseHttpRequestOptions.optionItems.httpsAgent)  {
                this.httpsAgent = this.baseHttpRequestOptions.optionItems.httpsAgent;
            }
            if (this.baseHttpRequestOptions.optionItems && this.baseHttpRequestOptions.optionItems.httpAgent)  {
                this.httpAgent = this.baseHttpRequestOptions.optionItems.httpAgent;
            }

            return this;
        }


        /**
         * 清除掉requestParams
         * @returns {HttpClient}
         */
        public clearAllParams() : HttpClient {
            this.queryParams = {};
            this.postParams = {};
            return this;
        }


        /**
         * 设置认证信息
         * @param authInfo
         * @returns {HttpClient}
         */
        public auth(authInfo:any) {
            switch(this.authType) {
                // 对于Token认证，设置头信息
                case BaseAuthType.TOKEN:
                    if (!isset(authInfo,"token")) {
                        throw {
                            code : ERR_DATA_TOKEN_NOT_VALID,
                            message: "AuthToken.token Not Set"
                        };
                    }
                    let headerKey = !empty(authInfo.headerKey) ? authInfo.headerKey : "Authorization";
                    this.headers[headerKey] = "Bearer "+authInfo.token;
                    break;
                case BaseAuthType.CRM_AUTH:
                case BaseAuthType.PORTAL_AUTH:
                    break;
            }
            return this;
        }


        /**
         * 设置Auth-Token
         * @param {string} token
         * @param {string} authTokenKey
         * @returns {HttpClient}
         * @throws {Error}
         */
        public authForToken(token:string,authTokenKey=null) : HttpClient {
            if (empty(token)) {
                throw {
                    code : ERR_DATA_TOKEN_NOT_VALID,
                    message : "Token设置无效"
                };
            }

            this.authType = BaseAuthType.TOKEN;
            return this.auth({token:token , headerKey: authTokenKey});
        }


        /**
         * 设置URL Query Params
         * @param {ItemObject} queryParams
         * @returns {HttpClient}
         */
        public setQueryParams(queryParams:ItemObject) : HttpClient {
            if (!empty(queryParams)) {
                this.queryParams = queryParams;
                this.urlPath = urlUtil(this.urlPath).setUrlQueryParams(this.queryParams);
            }
            return this;
        }

        /**
         * 设置POST数据
         * @param {ItemObject} postParams
         * @returns {HttpClient}
         */
        public setPostParams(postParams:ItemObject) : HttpClient {
            if (!empty(postParams)) {
                this.postParams = postParams;
            }
            return this;
        }

        /**
         * 设置路径上的参数进行路径值动态替换
         * @eg.
         *   http://host/path/{var1}  => http://host/path/pathsecond
         * @param {ItemObject} pathParams
         * @returns {HttpClient}
         */
        public setPathParams(pathParams:ItemObject) : HttpClient {
            if (isset(this.baseHttpRequestOptions,"path")) {
                this.urlPath = format(this.urlPath,pathParams);
            }

            return this;
        }

        /**
         * 增加Header节
         * @param {ItemObject} headerParams
         * @returns {HttpClient}
         */
        public addHeaders(headerParams:ItemObject) : HttpClient {
            this.headers = _.merge({},this.headers,headerParams);
            return this;
        }


        /**
         * 设置Axios的请求体
         * @returns {AxiosRequestConfig}
         */
        protected parseRequestOptions() : AxiosRequestConfig {
            let options:AxiosRequestConfig = {
                method   : this.method,
                baseURL  : this.baseURL,
                url      : this.urlPath,
                timeout  : this.timeout,
                headers  : this.headers
            };

            if (!empty(this.postParams)) {
                options["data"] = this.postParams;
            }

            if (this.httpsAgent) {
                options.httpsAgent = new https.Agent(this.httpsAgent)
            }
            if (this.httpAgent) {
                options.httpAgent = new http.Agent(this.httpAgent);
            }

            if (this.responseType) {
                options.responseType = this.responseType;
            }
            if (this.responseEncoding) {
                ///@ts-ignore
                options.responseEncoding = this.responseEncoding;
            }

            return options;
        }


        /**
         * @param {BaseHttpRequestParams} allParams
         * @returns {HttpClient}
         */
        public setAllParams(allParams:BaseHttpRequestParams) : HttpClient {
            if (empty(allParams)) {
                return this;
            }

            if (isset(allParams,"queryParams")) {
                this.setQueryParams(allParams.queryParams);
            }
            if (isset(allParams,"postParams")) {
                this.setPostParams(allParams.postParams);
            }
            if (isset(allParams,"pathParams")) {
                this.setPathParams(allParams.pathParams);
            }
            if (isset(allParams,"headerParams")) {
                this.addHeaders(allParams.headerParams);
            }
            if (isset(allParams,"authToken")) {
                this.authForToken(allParams.authToken,allParams.authTokenKey||null);
            }


            return this;
        }


        /**
         * 对于TCP:ECONNABORTED的重试请求处理
         * @param requestConfig
         * @param retryTimes
         */
        public retryTimeoutRequest(requestConfig:AxiosRequestConfig, retryTimes:number) {
            requestConfig.timeout = requestConfig.timeout || 0;
            requestConfig.timeout = requestConfig.timeout-2000;

            if (retryTimes<=0 || requestConfig.timeout<=0) {
                throw {
                    code: QinggerHttpClient.ERR_HTTP_REQUEST_ABORT_TIMEOUT,
                    status: 505,
                    message: "request timeout and retry ("+retryTimes+") times and timeout",
                    data: {}
                }
            }

            retryTimes = retryTimes-1;
            return axios(requestConfig).then((response)=>{
                return  HttpClient.ResolveHttpResponse(response);
            }).catch((err)=>{
                let errResponseData = err && err.response && err.response.data;

                if (err.request && err.code=="ECONNABORTED")  {
                    return this.retryTimeoutRequest(requestConfig,retryTimes)
                } else {
                    throw {
                        code: errResponseData && errResponseData.code || QinggerHttpClient.ERR_HTTP_REQUEST_ERROR,
                        status: err.response ? (err.response.status || 404) : 404,
                        message: (errResponseData && (errResponseData.message || errResponseData.msg)) || (err && err.message) || 'UNKNOWN MESSAGE',
                        data: errResponseData || {}
                    };
                }
            });
        }


        /**
         * 发送HTTP请求
         * @param {BaseHttpRequestOption} resOptions
         * @param {ItemObject} requestParams
         * @returns {Promise}
         */
        public sendRequest(resOptions:BaseHttpRequestOption=null,
                           requestParams:BaseHttpRequestParams=null) {
            if (!empty(resOptions)) {
                this.initRequestConfig(resOptions);
            }
            if (!empty(requestParams)) {
                this.setAllParams(requestParams);
            }

            let requestConfig = this.parseRequestOptions();
            let self = this;
            return axios(requestConfig).then(function (response : AxiosResponse)  {
                return HttpClient.ResolveHttpResponse(response);
            }).catch(function (err:AxiosError) {
                let errResponseData = err && err.response && err.response.data;
                if (err.request && (err.code=="ECONNABORTED" || err.message.search("timeout")!=-1))  {
                    // ECONNABORTED 超时重试
                    return self.retryTimeoutRequest(requestConfig,resOptions.timeoutTryTimes||3);
                }  else {
                    throw {
                        code: errResponseData && errResponseData.code || QinggerHttpClient.ERR_HTTP_REQUEST_ERROR,
                        status: err.response ? (err.response.status || 404) : 404,
                        message: (errResponseData && (errResponseData.message || errResponseData.msg)) || (err && err.message) || 'UNKNOWN MESSAGE',
                        data: errResponseData || {},
                        detail: err
                    };
                }
            });
        }


        /**
         * 带有Token的API请求
         * @param {BaseHttpRequestOption} resOptions
         * @param {BaseHttpRequestParams} requestParams
         * @param {FunctionRetPromise<string>} authTokenCallback : TOKEN取得的回调函数，此函数会返回一个Promise，决议值为token
         * @param cbArgs
         * @returns {Promise<AxiosResponse<any>>}
         */
        public sendRequestWithToken(resOptions:BaseHttpRequestOption=null,
                                    requestParams:BaseHttpRequestParams=null,
                                    authTokenCallback : FunctionRetPromise<string>=null,
                                    ...cbArgs) {
            if(empty(authTokenCallback)) {
                return this.sendRequest(resOptions,requestParams);
            } else {
                let self = this;
                let [cbCaller,...othCbArgs] = cbArgs;
                return authTokenCallback.call(cbCaller,...othCbArgs).then(function(token:string) {
                    if(empty(token)) {
                        throw {code : ERR_DATA_TOKEN_NOT_VALID,message : "TOKEN没有设置"};
                    }

                    requestParams.authToken = token;
                    requestParams.authTokenKey = resOptions.authTokenKey || null;
                    return self.sendRequest(resOptions,requestParams);
                });
            }
        }
    }


    /**
     * 导出HTTPCLIENT实例
     * @type {QinggerHttpClient.HttpClient}
     */
    export const httpClient = new HttpClient();
}