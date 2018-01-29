export declare namespace QinggerLibUtils {
    /**
     * 判断是否为空
     * @param val
     * @param {string} props
     * @returns {boolean}
     */
    function empty(val: any, props?: string): boolean;
    /**
     * 判断变量是否被设置
     * @note : 空对象{}返回为false
     * @param val
     * @param {string} props
     */
    function isset(val: any, props?: string): any;
    /**
     * 判断元素是否在数组中存在
     * @param {T} search
     * @param {Array<T>} arr
     * @param {number} index
     * @return {boolean}
     */
    function inArray<T = any>(search: T, arr: Array<T>, index?: number): boolean;
    /**
     * 生成初始数组
     * @param {number} index
     * @return {any[]}
     */
    function generateIndexArray(index: number): any[];
    /**
     * 生成随机整型数字
     * @param min
     * @param max
     * @return {any}
     */
    function getRandomInt(min?: number, max?: number): number;
    /**
     * timeout函数的Promise封装
     * @param ms
     * @return {Promise<any>}
     */
    function timeout(ms: any): Promise<{}>;
    /**
     * sleep函数封装
     * @param ts
     * @param fn
     * @param args
     * @return {Promise<any>}
     */
    function sleep(ts: any, fn: any, ...args: any[]): void;
}
