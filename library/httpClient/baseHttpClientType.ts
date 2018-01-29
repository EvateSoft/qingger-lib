/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2017/11/16
 * Time: 10:02
 */

/**
 * 基本验证类型
 */
import {ItemObject} from "../common/types";

export enum HttpProtocolType {
    METHOD_HTTP = 'http',
    METHOD_HTTPS = 'https'
}

/**
 * HTTP/HTTPS 默认端口
 */
export enum HttpWebDefaultPort {
    HTTP_DEFAULT_PORT  = 80,
    HTTPS_DEFAULT_PORT = 443
}

/**
 * 定义的类证类型
 */
export enum BaseAuthType {
    NONE,
    TOKEN,
    CRM_AUTH,
    PORTAL_AUTH
}

/**
 * HTTP Method类型
 */
export enum HttpMethod {
    GET   = 'GET',
    POST  = 'POST',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS'
}


/**
 * 应用API的提交请求的基本信息
 */
export interface BaseHttpRequestOption {
    name        : string;
    baseURL     : string;
    path        : string;
    method      : string;          // "GET" | "POST" | "DELETE" | "HEAD" | "PUT";
    version?    : string|number;
    auth?       : boolean;
    authType?   : BaseAuthType;
    headers?    : any;
    timeout?    : number;
    debug?      : boolean;
    fromJson?   : boolean;
    authTokenKey? : string;       // 定义包装TOKEN的HEADER的key名称
    reqLimit?   : number;         // 请求的限制时间(seconds)
    queryParams? : Array<any>;
    postParams? : Array<any>;
}

/**
 * 调用时请求的参数
 */
export interface BaseHttpRequestParams {
    queryParams? : ItemObject;
    postParams?  : ItemObject;
    pathParams?  : ItemObject;
    headerParams?: ItemObject;
    authToken?   : string;
    authTokenKey? : string;       // 定义包装TOKEN的HEADER的key名称
}
