"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2017/11/16
 * Time: 10:02
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HttpProtocolType;
(function (HttpProtocolType) {
    HttpProtocolType["METHOD_HTTP"] = "http";
    HttpProtocolType["METHOD_HTTPS"] = "https";
})(HttpProtocolType = exports.HttpProtocolType || (exports.HttpProtocolType = {}));
/**
 * HTTP/HTTPS 默认端口
 */
var HttpWebDefaultPort;
(function (HttpWebDefaultPort) {
    HttpWebDefaultPort[HttpWebDefaultPort["HTTP_DEFAULT_PORT"] = 80] = "HTTP_DEFAULT_PORT";
    HttpWebDefaultPort[HttpWebDefaultPort["HTTPS_DEFAULT_PORT"] = 443] = "HTTPS_DEFAULT_PORT";
})(HttpWebDefaultPort = exports.HttpWebDefaultPort || (exports.HttpWebDefaultPort = {}));
/**
 * 定义的类证类型
 */
var BaseAuthType;
(function (BaseAuthType) {
    BaseAuthType[BaseAuthType["NONE"] = 0] = "NONE";
    BaseAuthType[BaseAuthType["TOKEN"] = 1] = "TOKEN";
    BaseAuthType[BaseAuthType["CRM_AUTH"] = 2] = "CRM_AUTH";
    BaseAuthType[BaseAuthType["PORTAL_AUTH"] = 3] = "PORTAL_AUTH";
})(BaseAuthType = exports.BaseAuthType || (exports.BaseAuthType = {}));
/**
 * HTTP Method类型
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["UPDATE"] = "UPDATE";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
