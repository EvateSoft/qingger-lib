/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 15:53
 */
import { BaseAuthType, BaseHttpRequestOption, BaseHttpRequestParams, HttpMethod } from "./baseHttpClientType";
import { ItemObject, FunctionRetPromise } from "../common/types";
import { AxiosRequestConfig, AxiosResponse } from "axios";
/**
 * HTTP通信基础类(基于Axios)
 */
export declare namespace QinggerHttpClient {
    const ERR_DATA_TOKEN_NOT_VALID = 20400;
    const ERR_HTTP_REQUEST_ERROR = 20500;
    const ERR_HTTP_REQUEST_TIMEOUT = 20504;
    /**
     * HTTP连接类
     */
    class HttpClient {
        /** HTTP请求的选项配置 */
        protected baseHttpRequestOptions: BaseHttpRequestOption;
        /** 头部结构信息 */
        protected headers: ItemObject;
        /** 认证类型 */
        protected authType: BaseAuthType;
        protected method: HttpMethod;
        protected baseURL: string;
        protected urlPath: string;
        protected postParams: {};
        protected queryParams: {};
        protected timeout: number;
        protected requestName: string;
        constructor(requestOptions?: BaseHttpRequestOption);
        /**
         * 获取请求
         * @return ItemObject
         */
        getHttpClientRequestData(): {
            requestName: string;
            requestOptions: BaseHttpRequestOption;
            postParams: {};
            queryParams: {};
            baseURL: string;
            urlPath: string;
            authType: BaseAuthType;
            headers: ItemObject;
        };
        /**
         * 将HTTP的response返回数据中data字段返回回去
         * @param {AxiosResponse} response
         * @return {any}
         * @constructor
         */
        static ResolveHttpResponse(response: AxiosResponse): any;
        /**
         * 检查HTTP Response 状态值
         * 状态值在200~400间为正常
         * @param {AxiosResponse} response
         * @return {AxiosResponse | boolean}
         */
        static CheckHttpResponseStatus(response: AxiosResponse): boolean;
        /**
         * 对于请求选项进行初始化
         * @param {BaseHttpRequestOption} options
         * @return {QinggerHttpClient.HttpClient}
         */
        initRequestConfig(options: BaseHttpRequestOption): this;
        /**
         * 清除掉requestParams
         * @returns {HttpClient}
         */
        clearAllParams(): HttpClient;
        /**
         * 设置认证信息
         * @param authInfo
         * @returns {HttpClient}
         */
        auth(authInfo: any): this;
        /**
         * 设置Auth-Token
         * @param {string} token
         * @param {string} authTokenKey
         * @returns {HttpClient}
         * @throws {Error}
         */
        authForToken(token: string, authTokenKey?: any): HttpClient;
        /**
         * 设置URL Query Params
         * @param {ItemObject} queryParams
         * @returns {HttpClient}
         */
        setQueryParams(queryParams: ItemObject): HttpClient;
        /**
         * 设置POST数据
         * @param {ItemObject} postParams
         * @returns {HttpClient}
         */
        setPostParams(postParams: ItemObject): HttpClient;
        /**
         * 设置路径上的参数进行路径值动态替换
         * @eg.
         *   http://host/path/{var1}  => http://host/path/pathsecond
         * @param {ItemObject} pathParams
         * @returns {HttpClient}
         */
        setPathParams(pathParams: ItemObject): HttpClient;
        /**
         * 增加Header节
         * @param {ItemObject} headerParams
         * @returns {HttpClient}
         */
        addHeaders(headerParams: ItemObject): HttpClient;
        /**
         * 设置Axios的请求体
         * @returns {AxiosRequestConfig}
         */
        protected parseRequestOptions(): AxiosRequestConfig;
        /**
         * @param {BaseHttpRequestParams} allParams
         * @returns {HttpClient}
         */
        setAllParams(allParams: BaseHttpRequestParams): HttpClient;
        /**
         * 发送HTTP请求
         * @param {BaseHttpRequestOption} resOptions
         * @param {ItemObject} requestParams
         * @returns {Promise}
         */
        sendRequest(resOptions?: BaseHttpRequestOption, requestParams?: BaseHttpRequestParams): any;
        /**
         * 带有Token的API请求
         * @param {BaseHttpRequestOption} resOptions
         * @param {BaseHttpRequestParams} requestParams
         * @param {FunctionRetPromise<string>} authTokenCallback : TOKEN取得的回调函数，此函数会返回一个Promise，决议值为token
         * @param cbArgs
         * @returns {Promise<AxiosResponse<any>>}
         */
        sendRequestWithToken(resOptions?: BaseHttpRequestOption, requestParams?: BaseHttpRequestParams, authTokenCallback?: FunctionRetPromise<string>, ...cbArgs: any[]): any;
    }
    /**
     * 导出HTTPCLIENT实例
     * @type {QinggerHttpClient.HttpClient}
     */
    const httpClient: HttpClient;
}
