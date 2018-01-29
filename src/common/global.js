"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:35
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 全局变量的定义
 */
var QinggerLibVars;
(function (QinggerLibVars) {
    QinggerLibVars.ZERO = 0;
    QinggerLibVars.ONE = 1;
    QinggerLibVars.TWO = 2;
    QinggerLibVars.THREE = 3;
    QinggerLibVars.NO = 0;
    QinggerLibVars.YES = 1;
    QinggerLibVars.FAILED = 0;
    QinggerLibVars.SUCCESS = 1;
    QinggerLibVars.HTTP_SUCCESS = 200;
    QinggerLibVars.APP_SUCCESS = 20000;
    /* 表示关闭，结束... */
    QinggerLibVars.CLOSE = 0;
    /* 表示打开、启用... */
    QinggerLibVars.OPEN = 1;
    /* 表示删除 */
    QinggerLibVars.DELETE = 'delete';
    QinggerLibVars.CREATE = 'create';
    QinggerLibVars.UPDATE = 'update';
    /* 特殊标志 */
    QinggerLibVars.SPECIAL_9 = 9;
    QinggerLibVars.SPECIAL_99 = 99;
    /* 表示隐藏 */
    QinggerLibVars.HIDE = 0;
    /* 表示显示 */
    QinggerLibVars.SHOW = 1;
    /* 禁用 */
    QinggerLibVars.DISABLE = 0;
    /* 启用 */
    QinggerLibVars.ENABLE = 1;
    /* 下标 */
    QinggerLibVars.OFFSET_BEGIN = 0;
    /* MD5签名 */
    QinggerLibVars.SIGN_MD5 = 'MD5';
    /* SHA1签名 */
    QinggerLibVars.SIGN_SHA1 = "SHA1";
    /* 升序排序*/
    QinggerLibVars.SORT_ASCENDING = "ascending";
    /* 倒序排序 */
    QinggerLibVars.SORT_DESCENDING = "descending";
    QinggerLibVars.SORT_MONGOOSE_ASCENDING = 1; //  mongoose ascending order.
    QinggerLibVars.SORT_MONGOOSE_DESCENDING = -1; //  mongoose descending order
    QinggerLibVars.SORT_SQL_ASCENDING = 'asc'; // sql ascending order
    QinggerLibVars.SORT_SQL_DESCENDING = 'desc'; // sql descending order
})(QinggerLibVars = exports.QinggerLibVars || (exports.QinggerLibVars = {}));
