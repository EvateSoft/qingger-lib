"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 15:53
 */
const baseHttpClientType_1 = require("./baseHttpClientType");
const functions_1 = require("../utils/functions");
const urlUtil_1 = require("../utils/urlUtil");
const _ = require("lodash");
const format = require("string-template");
const axios = require('axios');
/**
 * HTTP通信基础类(基于Axios)
 */
var QinggerHttpClient;
(function (QinggerHttpClient) {
    var isset = functions_1.QinggerLibUtils.isset;
    var empty = functions_1.QinggerLibUtils.empty;
    var urlUtil = urlUtil_1.QinggerLibURL.urlUtil;
    QinggerHttpClient.ERR_DATA_TOKEN_NOT_VALID = 20400;
    QinggerHttpClient.ERR_HTTP_REQUEST_ERROR = 20500;
    /**
     * HTTP连接类
     */
    class HttpClient {
        constructor(requestOptions = null) {
            /** 认证类型 */
            this.authType = baseHttpClientType_1.BaseAuthType.NONE;
            this.method = baseHttpClientType_1.HttpMethod.GET;
            this.baseURL = '';
            this.urlPath = '/';
            this.postParams = {};
            this.queryParams = {};
            this.timeout = 10000;
            this.requestName = '';
            let defaultRequestConfig = requestOptions || {
                name: 'defaultName',
                method: "GET",
                baseURL: '',
                path: '/',
                auth: false,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            this.initRequestConfig(defaultRequestConfig);
        }
        /**
         * 获取请求
         * @return ItemObject
         */
        getHttpClientRequestData() {
            return {
                requestName: this.requestName,
                requestOptions: this.baseHttpRequestOptions,
                postParams: this.postParams,
                queryParams: this.queryParams,
                baseURL: this.baseURL,
                urlPath: this.urlPath,
                authType: this.authType,
                headers: this.headers
            };
        }
        /**
         * 将HTTP的response返回数据中data字段返回回去
         * @param {AxiosResponse} response
         * @return {any}
         * @constructor
         */
        static ResolveHttpResponse(response) {
            return response && response.data;
        }
        /**
         * 检查HTTP Response 状态值
         * 状态值在200~400间为正常
         * @param {AxiosResponse} response
         * @return {AxiosResponse | boolean}
         */
        static CheckHttpResponseStatus(response) {
            return response && response.status >= 200 && response.status < 400;
        }
        /**
         * 对于请求选项进行初始化
         * @param {BaseHttpRequestOption} options
         * @return {QinggerHttpClient.HttpClient}
         */
        initRequestConfig(options) {
            this.clearAllParams();
            this.baseHttpRequestOptions = options;
            this.method = _.defaultTo(this.baseHttpRequestOptions.method, "GET");
            this.baseURL = _.defaultTo(this.baseHttpRequestOptions.baseURL, "");
            this.urlPath = _.defaultTo(this.baseHttpRequestOptions.path, "/");
            this.authType = _.defaultTo(this.baseHttpRequestOptions.authType, baseHttpClientType_1.BaseAuthType.NONE);
            this.headers = _.defaultTo(this.baseHttpRequestOptions.headers, {});
            this.timeout = _.defaultTo(this.baseHttpRequestOptions.timeout, 10000);
            this.requestName = _.defaultTo(this.baseHttpRequestOptions.name, '');
            return this;
        }
        /**
         * 清除掉requestParams
         * @returns {HttpClient}
         */
        clearAllParams() {
            this.queryParams = {};
            this.postParams = {};
            return this;
        }
        /**
         * 设置认证信息
         * @param authInfo
         * @returns {HttpClient}
         */
        auth(authInfo) {
            switch (this.authType) {
                // 对于Token认证，设置头信息
                case baseHttpClientType_1.BaseAuthType.TOKEN:
                    if (!isset(authInfo, "token")) {
                        throw {
                            code: QinggerHttpClient.ERR_DATA_TOKEN_NOT_VALID,
                            message: "AuthToken.token Not Set"
                        };
                    }
                    let headerKey = !empty(authInfo.headerKey) ? authInfo.headerKey : "Authorization";
                    this.headers[headerKey] = "Bearer " + authInfo.token;
                    break;
                case baseHttpClientType_1.BaseAuthType.CRM_AUTH:
                case baseHttpClientType_1.BaseAuthType.PORTAL_AUTH:
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
        authForToken(token, authTokenKey = null) {
            if (empty(token)) {
                throw {
                    code: QinggerHttpClient.ERR_DATA_TOKEN_NOT_VALID,
                    message: "Token设置无效"
                };
            }
            this.authType = baseHttpClientType_1.BaseAuthType.TOKEN;
            return this.auth({ token: token, headerKey: authTokenKey });
        }
        /**
         * 设置URL Query Params
         * @param {ItemObject} queryParams
         * @returns {HttpClient}
         */
        setQueryParams(queryParams) {
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
        setPostParams(postParams) {
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
        setPathParams(pathParams) {
            if (isset(this.baseHttpRequestOptions, "path")) {
                this.urlPath = format(this.urlPath, pathParams);
            }
            return this;
        }
        /**
         * 增加Header节
         * @param {ItemObject} headerParams
         * @returns {HttpClient}
         */
        addHeaders(headerParams) {
            this.headers = _.merge({}, this.headers, headerParams);
            return this;
        }
        /**
         * 设置Axios的请求体
         * @returns {AxiosRequestConfig}
         */
        parseRequestOptions() {
            let options = {
                method: this.method,
                baseURL: this.baseURL,
                url: this.urlPath,
                timeout: this.timeout,
                headers: this.headers
            };
            if (!empty(this.postParams)) {
                options["data"] = this.postParams;
            }
            return options;
        }
        /**
         * @param {BaseHttpRequestParams} allParams
         * @returns {HttpClient}
         */
        setAllParams(allParams) {
            if (empty(allParams)) {
                return this;
            }
            if (isset(allParams, "queryParams")) {
                this.setQueryParams(allParams.queryParams);
            }
            if (isset(allParams, "postParams")) {
                this.setPostParams(allParams.postParams);
            }
            if (isset(allParams, "pathParams")) {
                this.setPathParams(allParams.pathParams);
            }
            if (isset(allParams, "headerParams")) {
                this.addHeaders(allParams.headerParams);
            }
            if (isset(allParams, "authToken")) {
                this.authForToken(allParams.authToken, allParams.authTokenKey || null);
            }
            return this;
        }
        /**
         * 发送HTTP请求
         * @param {BaseHttpRequestOption} resOptions
         * @param {ItemObject} requestParams
         * @returns {Promise}
         */
        sendRequest(resOptions = null, requestParams = null) {
            if (!empty(resOptions)) {
                this.initRequestConfig(resOptions);
            }
            if (!empty(requestParams)) {
                this.setAllParams(requestParams);
            }
            let requestConfig = this.parseRequestOptions();
            return axios(requestConfig).then(function (response) {
                return HttpClient.ResolveHttpResponse(response);
            }).catch(function (err) {
                throw {
                    code: QinggerHttpClient.ERR_HTTP_REQUEST_ERROR,
                    status: err.response ? (err.response.status || 404) : 404,
                    message: err.response ? (err.response.statusText || '') : '',
                    data: err.response ? (err.response.data || {}) : {}
                };
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
        sendRequestWithToken(resOptions = null, requestParams = null, authTokenCallback = null, ...cbArgs) {
            if (empty(authTokenCallback)) {
                return this.sendRequest(resOptions, requestParams);
            }
            else {
                let self = this;
                let [cbCaller, ...othCbArgs] = cbArgs;
                return authTokenCallback.call(cbCaller, ...othCbArgs).then(function (token) {
                    if (empty(token)) {
                        throw { code: QinggerHttpClient.ERR_DATA_TOKEN_NOT_VALID, message: "TOKEN没有设置" };
                    }
                    requestParams.authToken = token;
                    requestParams.authTokenKey = resOptions.authTokenKey || null;
                    return self.sendRequest(resOptions, requestParams);
                });
            }
        }
    }
    QinggerHttpClient.HttpClient = HttpClient;
    /**
     * 导出HTTPCLIENT实例
     * @type {QinggerHttpClient.HttpClient}
     */
    QinggerHttpClient.httpClient = new HttpClient();
})(QinggerHttpClient = exports.QinggerHttpClient || (exports.QinggerHttpClient = {}));
