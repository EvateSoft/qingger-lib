/// <reference path="../../../library/common/types.d.ts" />
import { ItemObject } from "../common/types";
/**
 * URL工具类，用来构造URL，查询URL参数、HOST、PORT等
 */
export declare namespace QinggerLibURL {
    class URLUtil {
        protected url: string;
        protected jsUrlObj: any;
        /**
         * 将URL解析成 [PROTOCOL://HOST..] 正确的格式
         * @param url
         * @return {any}
         * @constructor
         */
        static ProcessCorrectURL(url: any): any;
        constructor(url?: string);
        /**
         * 获取URL
         * @return {string}
         */
        getUrl(): string;
        /**
         * 获取URL实际的HOST地址
         * @eg
         *   http://host/path1 => host
         *   http://host:80/path2 => host:80
         * @param {boolean} withProtocol
         */
        getUrlHost(withProtocol?: boolean): string;
        /**
         * 针对URL设置Query参数
         * @param {ItemObject} params
         * @return {string}
         */
        setUrlQueryParams(params: ItemObject): string;
        /**
         * 将URL中的query解析成对象字面量格式
         * @return {ItemObject}
         */
        getUrlQueryAllParams(): ItemObject;
        /**
         * URL上是否带有queryItem参数
         * @param {string} queryItem
         * @return {boolean}
         */
        hasUrlQueryItem(queryItem: string): boolean;
        /**
         * 获得某一个query参数的值
         * @param {string} queryItem
         * @return {string}
         */
        getUrlQueryItem(queryItem: string): string;
    }
    /**
     * 生成URLUtil对象
     * @param {string} url
     * @return {QinggerLibURL.URLUtil}
     */
    function urlUtil(url?: string): URLUtil;
}
