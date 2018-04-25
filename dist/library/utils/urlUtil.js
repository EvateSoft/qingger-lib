"use strict";
///  <reference path="../common/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var functions_1 = require("./functions");
/**
 * 对于操作URL的工具类
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 13:42
 */
var Uri = require("jsuri");
var qs = require("qs");
var _ = require("lodash");
/**
 * URL工具类，用来构造URL，查询URL参数、HOST、PORT等
 */
var QinggerLibURL;
(function (QinggerLibURL) {
    var empty = functions_1.QinggerLibUtils.empty;
    var URLUtil = /** @class */ (function () {
        function URLUtil(url) {
            if (url === void 0) { url = ''; }
            this.url = '';
            this.jsUrlObj = null;
            this.url = URLUtil.ProcessCorrectURL(url);
            this.jsUrlObj = new Uri(this.url);
        }
        /**
         * 将URL解析成 [PROTOCOL://HOST..] 正确的格式
         * @param url
         * @return {any}
         * @constructor
         */
        URLUtil.ProcessCorrectURL = function (url) {
            if (!url) {
                return '';
                //return url;
            }
            // // 如果URL上首字母是/
            // if (url.map(/^\//)) {
            //     return url;
            // }
            //
            // if (!url.match(/^(http[s]?|ftp):\/\//)) {
            //    url = 'http://'+url;
            // }
            return url;
        };
        /**
         * 获取URL
         * @return {string}
         */
        URLUtil.prototype.getUrl = function () {
            return this.url;
        };
        /**
         * 获取URL实际的HOST地址
         * @eg
         *   http://host/path1 => host
         *   http://host:80/path2 => host:80
         * @param {boolean} withProtocol
         */
        URLUtil.prototype.getUrlHost = function (withProtocol) {
            if (withProtocol === void 0) { withProtocol = false; }
            var port = this.jsUrlObj.port();
            var host = this.jsUrlObj.host() + ((port == 80 || port == 443 || !port) ? "" : ":" + port);
            if (!host) {
                return ''; // 空地址
            }
            else {
                return withProtocol ? this.jsUrlObj.protocol() + "://" + host : host;
            }
        };
        /**
         * 针对URL设置Query参数
         * @param {ItemObject} params
         * @return {string}
         */
        URLUtil.prototype.setUrlQueryParams = function (params) {
            var self = this;
            if (!empty(params)) {
                _.each(params, function (item, key) {
                    if (self.jsUrlObj.hasQueryParam(key)) {
                        self.jsUrlObj.replaceQueryParam(key, item);
                    }
                    else {
                        self.jsUrlObj.addQueryParam(key, item);
                    }
                });
            }
            return this.jsUrlObj.toString();
        };
        /**
         * 将URL中的query解析成对象字面量格式
         * @return {ItemObject}
         */
        URLUtil.prototype.getUrlQueryAllParams = function () {
            var queryString = _.replace(this.jsUrlObj.query(), /^\?/, '');
            return qs.parse(queryString);
        };
        /**
         * URL上是否带有queryItem参数
         * @param {string} queryItem
         * @return {boolean}
         */
        URLUtil.prototype.hasUrlQueryItem = function (queryItem) {
            return this.jsUrlObj.hasQueryParam(queryItem);
        };
        /**
         * 获得某一个query参数的值
         * @param {string} queryItem
         * @return {string}
         */
        URLUtil.prototype.getUrlQueryItem = function (queryItem) {
            return this.jsUrlObj.getQueryParamValue(queryItem);
        };
        return URLUtil;
    }());
    QinggerLibURL.URLUtil = URLUtil;
    /**
     * 生成URLUtil对象
     * @param {string} url
     * @return {QinggerLibURL.URLUtil}
     */
    function urlUtil(url) {
        if (url === void 0) { url = ''; }
        var realUrl = '';
        try {
            // if not window object, will throw ReferenceError
            realUrl = url || window.location.href;
        }
        catch (err) {
        }
        finally {
            realUrl = url;
        }
        return new URLUtil(realUrl);
    }
    QinggerLibURL.urlUtil = urlUtil;
})(QinggerLibURL = exports.QinggerLibURL || (exports.QinggerLibURL = {}));
