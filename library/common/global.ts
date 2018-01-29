/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:35
 */

/**
 * 全局变量的定义
 */
export namespace QinggerLibVars {

    export const ZERO = 0;
    export const ONE  = 1;
    export const TWO  = 2;
    export const THREE = 3;


    export const NO  = 0;
    export const YES = 1;
    export const FAILED = 0;
    export const SUCCESS = 1;

    export const HTTP_SUCCESS = 200;
    export const APP_SUCCESS = 20000;

    /* 表示关闭，结束... */
    export const CLOSE = 0;
    /* 表示打开、启用... */
    export const OPEN = 1;

    /* 表示删除 */
    export const DELETE = 'delete';
    export const CREATE = 'create';
    export const UPDATE = 'update';

    /* 特殊标志 */
    export const SPECIAL_9 = 9;
    export const SPECIAL_99 = 99;

    /* 表示隐藏 */
    export const HIDE = 0;
    /* 表示显示 */
    export const SHOW = 1;

    /* 禁用 */
    export const DISABLE = 0;
    /* 启用 */
    export const ENABLE = 1;

    /* 下标 */
    export const OFFSET_BEGIN = 0;

    /* MD5签名 */
    export const SIGN_MD5 = 'MD5';
    /* SHA1签名 */
    export const SIGN_SHA1 = "SHA1";

    /* 升序排序*/
    export const SORT_ASCENDING = "ascending";
    /* 倒序排序 */
    export const SORT_DESCENDING = "descending";


    export const SORT_MONGOOSE_ASCENDING = 1;       //  mongoose ascending order.
    export const SORT_MONGOOSE_DESCENDING = -1;     //  mongoose descending order


    export const SORT_SQL_ASCENDING = 'asc';        // sql ascending order
    export const SORT_SQL_DESCENDING = 'desc';      // sql descending order
}

