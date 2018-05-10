"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:50
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var hasValue = require("has-value");
var QinggerLibUtils;
(function (QinggerLibUtils) {
    /**
     * 判断是否为空
     * @param val
     * @param {string} props
     * @returns {boolean}
     */
    function empty(val, props) {
        if (props === void 0) { props = null; }
        if (!val)
            return true;
        if (_.isNumber(val) || _.isString(val) || _.isBoolean(val)) {
            return !val;
        }
        return !hasValue(val, props);
    }
    QinggerLibUtils.empty = empty;
    /**
     * 判断变量是否被设置
     * @note : 空对象{}返回为false
     * @param val
     * @param {string} props
     */
    function isset(val, props) {
        if (props === void 0) { props = null; }
        if (val == 0 || val == false) {
            return true;
        }
        if (!val)
            return false;
        return hasValue(val, props);
    }
    QinggerLibUtils.isset = isset;
    /**
     * 判断元素是否在数组中存在
     * @param {T} search
     * @param {Array<T>} arr
     * @param {number} index
     * @return {boolean}
     */
    function inArray(search, arr, index) {
        if (index === void 0) { index = 0; }
        if (_.isArray(arr)) {
            return arr.includes(search, index);
        }
        else {
            return false;
        }
    }
    QinggerLibUtils.inArray = inArray;
    /**
     * 生成初始数组
     * @param {number} index
     * @return {any[]}
     */
    function generateIndexArray(index) {
        var ret = new Array(index);
        for (var i = 0; i < index; i++) {
            ret[i] = i;
        }
        return ret;
    }
    QinggerLibUtils.generateIndexArray = generateIndexArray;
    /**
     * 生成随机整型数字
     * @param min
     * @param max
     * @return {any}
     */
    function getRandomInt(min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 999999999; }
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
    QinggerLibUtils.getRandomInt = getRandomInt;
    /**
     * timeout函数的Promise封装
     * @param ms
     * @return {Promise<any>}
     */
    function timeout(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
        // return new Promise(resolve => setTimeout(resolve, ms));
    }
    QinggerLibUtils.timeout = timeout;
    /**
     * sleep函数封装
     * @param ts
     * @param fn
     * @param args
     * @return {Promise<any>}
     */
    function sleep(ts, fn) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        timeout(ts).then(function () {
            return fn.apply(void 0, args);
        });
    }
    QinggerLibUtils.sleep = sleep;
})(QinggerLibUtils = exports.QinggerLibUtils || (exports.QinggerLibUtils = {}));
//# sourceMappingURL=functions.js.map