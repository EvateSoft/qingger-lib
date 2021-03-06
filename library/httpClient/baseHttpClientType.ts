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
import {AgentOptions} from "https";

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
 *
 */
export interface BaseHttpRequestOption extends ItemObject {
    name        : string;
    baseURL     : string;
    path        : string;
    method      : string;          // "GET" | "POST" | "DELETE" | "HEAD" | "PUT";
    version?    : string|number;
    auth?       : boolean;
    authType?   : BaseAuthType;
    headers?    : any;
    timeout?    : number;
    timeoutTryTimes?: number;       // 超时的重试机制，重试次数,如果不需要重试，设置成-1
    debug?      : boolean;
    fromJson?   : boolean;
    authTokenKey? : string;       // 定义包装TOKEN的HEADER的key名称
    reqLimit?   : number;         // 请求的限制时间(seconds)
    queryParams? : any;
    postParams? : any;
    tokenType? : string;
    jsonFile? : string;

    responseType?: string;        // 返回的数据结构类型，默认为utf8编码的字符串,如果是图片等裸数据类型，使用"arraybuffer"
    responseEncoding?: string;    // 如果是需要二进行解码，使用"binary"

    optionItems?  : {
        httpsAgent?: AgentOptions
        httpAgent? : ItemObject
    }
}

/**
 * 调用时请求的参数
 */
export interface BaseHttpRequestParams extends ItemObject {
    queryParams? : ItemObject;
    postParams?  : ItemObject;
    pathParams?  : ItemObject;
    headerParams?: ItemObject;
    authToken?   : string;
    authTokenKey? : string;       // 定义包装TOKEN的HEADER的key名称
}
