/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2017/11/16
 * Time: 10:02
 */
/**
 * 基本验证类型
 */
import { ItemObject } from "../common/types";
export declare enum HttpProtocolType {
    METHOD_HTTP = "http",
    METHOD_HTTPS = "https",
}
/**
 * HTTP/HTTPS 默认端口
 */
export declare enum HttpWebDefaultPort {
    HTTP_DEFAULT_PORT = 80,
    HTTPS_DEFAULT_PORT = 443,
}
/**
 * 定义的类证类型
 */
export declare enum BaseAuthType {
    NONE = 0,
    TOKEN = 1,
    CRM_AUTH = 2,
    PORTAL_AUTH = 3,
}
/**
 * HTTP Method类型
 */
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
}
/**
 * 应用API的提交请求的基本信息
 */
export interface BaseHttpRequestOption {
    name: string;
    baseURL: string;
    path: string;
    method: string;
    version?: string | number;
    auth?: boolean;
    authType?: BaseAuthType;
    headers?: any;
    timeout?: number;
    debug?: boolean;
    fromJson?: boolean;
    authTokenKey?: string;
    reqLimit?: number;
    queryParams?: Array<any>;
    postParams?: Array<any>;
    tokenType? : string;
}
/**
 * 调用时请求的参数
 */
export interface BaseHttpRequestParams {
    queryParams?: ItemObject;
    postParams?: ItemObject;
    pathParams?: ItemObject;
    headerParams?: ItemObject;
    authToken?: string;
    authTokenKey?: string;
}
