"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 15:53
 */
var baseHttpClientType_1 = require("./baseHttpClientType");
var functions_1 = require("../utils/functions");
var urlUtil_1 = require("../utils/urlUtil");
var _ = require("lodash");
var format = require("string-template");
var axios = require('axios');
var https = require('https');
var http = require("http");
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
    QinggerHttpClient.ERR_HTTP_REQUEST_TIMEOUT = 20504;
    QinggerHttpClient.ERR_HTTP_REQUEST_ABORT_TIMEOUT = 20505;
    /**
     * HTTP连接类
     */
    var HttpClient = /** @class */ (function () {
        function HttpClient(requestOptions) {
            if (requestOptions === void 0) { requestOptions = null; }
            /** 认证类型 */
            this.authType = baseHttpClientType_1.BaseAuthType.NONE;
            this.method = baseHttpClientType_1.HttpMethod.GET;
            this.baseURL = '';
            this.urlPath = '/';
            this.postParams = {};
            this.queryParams = {};
            this.timeout = 5000;
            this.timeoutRetryTimes = 3;
            this.requestName = '';
            /**
             * HTTPS-Agent
             */
            this.httpsAgent = null;
            /**
             * HTTP-Agent
             */
            this.httpAgent = null;
            /* 以下两个设置后可以返回数据流 (arraybuffer/binary)*/
            this.responseType = '';
            this.responseEncoding = '';
            var defaultRequestConfig = requestOptions || {
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
        HttpClient.prototype.getHttpClientRequestData = function () {
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
        };
        /**
         * 将HTTP的response返回数据中data字段返回回去
         * @param {AxiosResponse} response
         * @return {any}
         * @constructor
         */
        HttpClient.ResolveHttpResponse = function (response) {
            return response && response.data;
        };
        /**
         * 检查HTTP Response 状态值
         * 状态值在200~400间为正常
         * @param {AxiosResponse} response
         * @return {AxiosResponse | boolean}
         */
        HttpClient.CheckHttpResponseStatus = function (response) {
            return response && response.status >= 200 && response.status < 400;
        };
        /**
         * 对于请求选项进行初始化
         * @param {BaseHttpRequestOption} options
         * @return {QinggerHttpClient.HttpClient}
         */
        HttpClient.prototype.initRequestConfig = function (options) {
            this.clearAllParams();
            this.baseHttpRequestOptions = options;
            this.method = _.defaultTo(this.baseHttpRequestOptions.method, "GET");
            this.baseURL = _.defaultTo(this.baseHttpRequestOptions.baseURL, "");
            this.urlPath = _.defaultTo(this.baseHttpRequestOptions.path, "/");
            this.authType = _.defaultTo(this.baseHttpRequestOptions.authType, baseHttpClientType_1.BaseAuthType.NONE);
            this.headers = _.defaultTo(this.baseHttpRequestOptions.headers, {});
            this.timeout = _.defaultTo(this.baseHttpRequestOptions.timeout, 5000);
            this.requestName = _.defaultTo(this.baseHttpRequestOptions.name, '');
            this.responseType = _.defaultTo(this.baseHttpRequestOptions.responseType, '');
            this.responseEncoding = _.defaultTo(this.baseHttpRequestOptions.responseEncoding, '');
            this.timeoutRetryTimes = _.defaultTo(this.baseHttpRequestOptions.timeoutTryTimes, 3);
            // 必须初始化(否则会沿用老的)
            this.httpAgent = this.httpsAgent = null;
            if (this.baseHttpRequestOptions.optionItems && this.baseHttpRequestOptions.optionItems.httpsAgent) {
                this.httpsAgent = this.baseHttpRequestOptions.optionItems.httpsAgent;
            }
            if (this.baseHttpRequestOptions.optionItems && this.baseHttpRequestOptions.optionItems.httpAgent) {
                this.httpAgent = this.baseHttpRequestOptions.optionItems.httpAgent;
            }
            return this;
        };
        /**
         * 清除掉requestParams
         * @returns {HttpClient}
         */
        HttpClient.prototype.clearAllParams = function () {
            this.queryParams = {};
            this.postParams = {};
            return this;
        };
        /**
         * 设置认证信息
         * @param authInfo
         * @returns {HttpClient}
         */
        HttpClient.prototype.auth = function (authInfo) {
            switch (this.authType) {
                // 对于Token认证，设置头信息
                case baseHttpClientType_1.BaseAuthType.TOKEN:
                    if (!isset(authInfo, "token")) {
                        throw {
                            code: QinggerHttpClient.ERR_DATA_TOKEN_NOT_VALID,
                            message: "AuthToken.token Not Set"
                        };
                    }
                    var headerKey = !empty(authInfo.headerKey) ? authInfo.headerKey : "Authorization";
                    this.headers[headerKey] = "Bearer " + authInfo.token;
                    break;
                case baseHttpClientType_1.BaseAuthType.CRM_AUTH:
                case baseHttpClientType_1.BaseAuthType.PORTAL_AUTH:
                    break;
            }
            return this;
        };
        /**
         * 设置Auth-Token
         * @param {string} token
         * @param {string} authTokenKey
         * @returns {HttpClient}
         * @throws {Error}
         */
        HttpClient.prototype.authForToken = function (token, authTokenKey) {
            if (authTokenKey === void 0) { authTokenKey = null; }
            if (empty(token)) {
                throw {
                    code: QinggerHttpClient.ERR_DATA_TOKEN_NOT_VALID,
                    message: "Token设置无效"
                };
            }
            this.authType = baseHttpClientType_1.BaseAuthType.TOKEN;
            return this.auth({ token: token, headerKey: authTokenKey });
        };
        /**
         * 设置URL Query Params
         * @param {ItemObject} queryParams
         * @returns {HttpClient}
         */
        HttpClient.prototype.setQueryParams = function (queryParams) {
            if (!empty(queryParams)) {
                this.queryParams = queryParams;
                this.urlPath = urlUtil(this.urlPath).setUrlQueryParams(this.queryParams);
            }
            return this;
        };
        /**
         * 设置POST数据
         * @param {ItemObject} postParams
         * @returns {HttpClient}
         */
        HttpClient.prototype.setPostParams = function (postParams) {
            if (!empty(postParams)) {
                this.postParams = postParams;
            }
            return this;
        };
        /**
         * 设置路径上的参数进行路径值动态替换
         * @eg.
         *   http://host/path/{var1}  => http://host/path/pathsecond
         * @param {ItemObject} pathParams
         * @returns {HttpClient}
         */
        HttpClient.prototype.setPathParams = function (pathParams) {
            if (isset(this.baseHttpRequestOptions, "path")) {
                this.urlPath = format(this.urlPath, pathParams);
            }
            return this;
        };
        /**
         * 增加Header节
         * @param {ItemObject} headerParams
         * @returns {HttpClient}
         */
        HttpClient.prototype.addHeaders = function (headerParams) {
            this.headers = _.merge({}, this.headers, headerParams);
            return this;
        };
        /**
         * 设置Axios的请求体
         * @returns {AxiosRequestConfig}
         */
        HttpClient.prototype.parseRequestOptions = function () {
            var options = {
                method: this.method,
                baseURL: this.baseURL,
                url: this.urlPath,
                timeout: this.timeout,
                headers: this.headers
            };
            if (!empty(this.postParams)) {
                options["data"] = this.postParams;
            }
            if (this.httpsAgent) {
                options.httpsAgent = new https.Agent(this.httpsAgent);
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
        };
        /**
         * @param {BaseHttpRequestParams} allParams
         * @returns {HttpClient}
         */
        HttpClient.prototype.setAllParams = function (allParams) {
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
        };
        /**
         * 对于TCP:ECONNABORTED的重试请求处理
         * @param requestConfig
         * @param retryTimes
         */
        HttpClient.prototype.retryTimeoutRequest = function (requestConfig, retryTimes) {
            var _this = this;
            requestConfig.timeout = requestConfig.timeout || 0;
            requestConfig.timeout = requestConfig.timeout - 2000;
            if (retryTimes <= 0 || requestConfig.timeout <= 0) {
                throw {
                    code: QinggerHttpClient.ERR_HTTP_REQUEST_ABORT_TIMEOUT,
                    status: 505,
                    message: "request timeout and retry (" + retryTimes + ") times and timeout",
                    data: {}
                };
            }
            retryTimes = retryTimes - 1;
            return axios(requestConfig).then(function (response) {
                return HttpClient.ResolveHttpResponse(response);
            }).catch(function (err) {
                var errResponseData = err && err.response && err.response.data;
                if (err.request && err.code == "ECONNABORTED") {
                    return _this.retryTimeoutRequest(requestConfig, retryTimes);
                }
                else {
                    throw {
                        code: errResponseData && errResponseData.code || QinggerHttpClient.ERR_HTTP_REQUEST_ERROR,
                        status: err.response ? (err.response.status || 404) : 404,
                        message: (errResponseData && (errResponseData.message || errResponseData.msg)) || (err && err.message) || 'UNKNOWN MESSAGE',
                        data: errResponseData || {}
                    };
                }
            });
        };
        /**
         * 发送HTTP请求
         * @param {BaseHttpRequestOption} resOptions
         * @param {ItemObject} requestParams
         * @returns {Promise}
         */
        HttpClient.prototype.sendRequest = function (resOptions, requestParams) {
            if (resOptions === void 0) { resOptions = null; }
            if (requestParams === void 0) { requestParams = null; }
            if (!empty(resOptions)) {
                this.initRequestConfig(resOptions);
            }
            if (!empty(requestParams)) {
                this.setAllParams(requestParams);
            }
            var requestConfig = this.parseRequestOptions();
            var self = this;
            return axios(requestConfig).then(function (response) {
                return HttpClient.ResolveHttpResponse(response);
            }).catch(function (err) {
                var errResponseData = err && err.response && err.response.data;
                if (err.request && (err.code == "ECONNABORTED" || err.message.search("timeout") != -1)) {
                    // ECONNABORTED 超时重试
                    return self.retryTimeoutRequest(requestConfig, resOptions.timeoutTryTimes || 3);
                }
                else {
                    throw {
                        code: errResponseData && errResponseData.code || QinggerHttpClient.ERR_HTTP_REQUEST_ERROR,
                        status: err.response ? (err.response.status || 404) : 404,
                        message: (errResponseData && (errResponseData.message || errResponseData.msg)) || (err && err.message) || 'UNKNOWN MESSAGE',
                        data: errResponseData || {},
                        detail: err
                    };
                }
            });
        };
        /**
         * 带有Token的API请求
         * @param {BaseHttpRequestOption} resOptions
         * @param {BaseHttpRequestParams} requestParams
         * @param {FunctionRetPromise<string>} authTokenCallback : TOKEN取得的回调函数，此函数会返回一个Promise，决议值为token
         * @param cbArgs
         * @returns {Promise<AxiosResponse<any>>}
         */
        HttpClient.prototype.sendRequestWithToken = function (resOptions, requestParams, authTokenCallback) {
            if (resOptions === void 0) { resOptions = null; }
            if (requestParams === void 0) { requestParams = null; }
            if (authTokenCallback === void 0) { authTokenCallback = null; }
            var cbArgs = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                cbArgs[_i - 3] = arguments[_i];
            }
            if (empty(authTokenCallback)) {
                return this.sendRequest(resOptions, requestParams);
            }
            else {
                var self_1 = this;
                var cbCaller = cbArgs[0], othCbArgs = cbArgs.slice(1);
                return authTokenCallback.call.apply(authTokenCallback, [cbCaller].concat(othCbArgs)).then(function (token) {
                    if (empty(token)) {
                        throw { code: QinggerHttpClient.ERR_DATA_TOKEN_NOT_VALID, message: "TOKEN没有设置" };
                    }
                    requestParams.authToken = token;
                    requestParams.authTokenKey = resOptions.authTokenKey || null;
                    return self_1.sendRequest(resOptions, requestParams);
                });
            }
        };
        return HttpClient;
    }());
    QinggerHttpClient.HttpClient = HttpClient;
    /**
     * 导出HTTPCLIENT实例
     * @type {QinggerHttpClient.HttpClient}
     */
    QinggerHttpClient.httpClient = new HttpClient();
})(QinggerHttpClient = exports.QinggerHttpClient || (exports.QinggerHttpClient = {}));
