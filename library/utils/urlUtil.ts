///  <reference path="../common/types.d.ts" />

import {QinggerLibUtils} from "./functions";

/**
 * 对于操作URL的工具类
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 13:42
 */
const Uri = require("jsuri");
const qs = require("qs");
const _ = require("lodash");

import {ItemObject} from "../common/types";

declare const window: ItemObject;

/**
 * URL工具类，用来构造URL，查询URL参数、HOST、PORT等
 */
export namespace QinggerLibURL {

    /**
     * HTTP方法
     */
    import isset = QinggerLibUtils.isset;
    import empty = QinggerLibUtils.empty;



    export class URLUtil {

        protected url = '';
        protected jsUrlObj = null;

        /**
         * 将URL解析成 [PROTOCOL://HOST..] 正确的格式
         * @param url
         * @return {any}
         * @constructor
         */
        public static ProcessCorrectURL(url) {
           if(!url) {
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
        }

        public constructor(url='') {
           this.url = URLUtil.ProcessCorrectURL(url);
           this.jsUrlObj = new Uri(this.url);
        }

        /**
         * 获取URL
         * @return {string}
         */
        public getUrl() {
           return this.url;
        }


        /**
         * 获取URL实际的HOST地址
         * @eg
         *   http://host/path1 => host
         *   http://host:80/path2 => host:80
         * @param {boolean} withProtocol
         */
        public getUrlHost(withProtocol:boolean=false) {
            let port = this.jsUrlObj.port();
            let host = this.jsUrlObj.host()  + ((port == 80 || port == 443 || !port) ? "" : ":"+port)
            if (!host) {
                return ''; // 空地址
            } else {
                return withProtocol ? this.jsUrlObj.protocol()   + "://" + host : host;
            }
        }

        /**
         * 针对URL设置Query参数
         * @param {ItemObject} params
         * @return {string}
         */
        public setUrlQueryParams(params: ItemObject): string {
            let self = this;
            if (!empty(params)) {
                _.each(params,function (item, key) {
                    if (!item) { // 如果值是空值，则删掉数据
                        self.jsUrlObj.deleteQueryParam(key);
                    }
                    else if (self.jsUrlObj.hasQueryParam(key)) {
                        self.jsUrlObj.replaceQueryParam(key, item);
                    }
                    else {
                        self.jsUrlObj.addQueryParam(key, item);
                    }
                })
            }
            return this.jsUrlObj.toString();
        }


        /**
         * 将URL中的query解析成对象字面量格式
         * @return {ItemObject}
         */
        public getUrlQueryAllParams() : ItemObject {
            let queryString = _.replace(this.jsUrlObj.query(),/^\?/,'');
            return qs.parse(queryString);
        }

        /**
         * URL上是否带有queryItem参数
         * @param {string} queryItem
         * @return {boolean}
         */
        public hasUrlQueryItem(queryItem:string) :boolean {
            return this.jsUrlObj.hasQueryParam(queryItem);
        }

        /**
         * 获得某一个query参数的值
         * @param {string} queryItem
         * @return {string}
         */
        public getUrlQueryItem(queryItem:string) : string {
            return this.jsUrlObj.getQueryParamValue(queryItem);
        }

        /**
         * 获得URL路径上的Item
         * @param {number} index
         * @return {string}
         */
        public getUrlPathItem(index:number) : string {
            let urlPath = this.jsUrlObj.path();
            let pathItems = urlPath.split("/");
            let pathItemLength = pathItems.length;
            if (index>=0) {
                return pathItems[index] || '';
            } else {
                let actualIndex = pathItemLength-Math.abs(index);
                return actualIndex>=0 ? pathItems[actualIndex] : '';
            }
        }
    }

    /**
     * 生成URLUtil对象
     * @param {string} url
     * @return {QinggerLibURL.URLUtil}
     */
    export function urlUtil(url:string='') : URLUtil {
        let realUrl = '';
        try{
            // if not window object, will throw ReferenceError
            realUrl = url || window.location.href;
        }catch(err) {
        }finally {
           realUrl = url;
        }
        return new URLUtil(realUrl);
    }
}