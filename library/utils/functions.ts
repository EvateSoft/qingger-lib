/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:50
 */

const _  = require("lodash");
const hasValue = require("has-value");

export namespace QinggerLibUtils {

    /**
     * 判断是否为空
     * @param val
     * @param {string} props
     * @returns {boolean}
     */
    export function empty(val:any, props:string=null) :boolean {
        if (!val)
            return true;

        if (_.isNumber(val) || _.isString(val) || _.isBoolean(val)) {
            return !val;
        }

        return !hasValue(val, props);
    }

    /**
     * 判断变量是否被设置
     * @note : 空对象{}返回为false
     * @param val
     * @param {string} props
     */
    export function isset(val:any, props:string=null) {
        if (val == 0 || val == false) {  // 固定值设置为true
            return true;
        }
        if (!val)
            return false;

        if (!props) {
            return !!val;
        } else {
            return !!val[props];
        }
        //return !!val[props];
        //return hasValue(val,props);
    }



    /**
     * 判断元素是否在数组中存在
     * @param {T} search
     * @param {Array<T>} arr
     * @param {number} index
     * @return {boolean}
     */
    export function inArray<T=any>(search:T,arr:Array<T>,index:number=0){
        if(_.isArray(arr)) {
            return arr.includes(search,index);
        } else {
            return false;
        }
    }


    /**
     * 生成初始数组
     * @param {number} index
     * @return {any[]}
     */
    export function generateIndexArray(index:number) {
        let ret = new Array(index);
        for(let i=0;i<index;i++) {
            ret[i] = i;
        }
        return ret;
    }


    /**
     * 生成随机整型数字
     * @param min
     * @param max
     * @return {any}
     */
    export function getRandomInt(min=0, max=999999999) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }


    /**
     * timeout函数的Promise封装
     * @param ms
     * @return {Promise<any>}
     */
    export function timeout(ms) {
        return new Promise(function(resolve){
          setTimeout(resolve,ms);
        });
        // return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * sleep函数封装
     * @param ts
     * @param fn
     * @param args
     * @return {Promise<any>}
     */
    export function sleep(ts,fn, ...args) {
        timeout(ts).then(function(){
           return fn(...args);
        });
    }

}
