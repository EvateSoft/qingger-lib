/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:56
 */

const moment = require('moment');
const _ = require("lodash");
import {Moment,DurationInputArg1,DurationInputArg2} from "moment";



export namespace QinggerLibDateTime {

    export type DTParam = DateTimeParser | Moment | string | number | Date | any;

    export enum TimestampType { TS_SECOND,TS_MILLISECOND }

    /**
     * 定义日期的开始日期基准
     * @type {string}
     */
    export const BEGIN_DATE = '1970-01-01';

    /**
     * 时间格式化方式
     */
    export enum DTFormatType {
        YMDHMS = 'YYYY-MM-DD HH:mm:ss',
        YMD    = 'YYYY-MM-DD',
        HMS    = "HH:mm:ss"
    }

    /**
     * moment库中使用到的一些常量定义
     */
    export enum DTItemKey {
        years = 'years',
        quarters = 'quarters',
        months = 'months',
        weeks = 'weeks',
        days = 'days',
        hours = 'hours',
        minutes = 'minutes',
        seconds = 'seconds',
        milliseconds = 'milliseconds'
    }


    /**
     * Qingger-DateTimeParser处理日期时间类
     */
    export class DateTimeParser {

        /**
         * moment对象实例
         * @type {Moment}
         */
        protected momentObject = null;

        /**
         * static : 检查ts变量计数值单位是秒还是毫秒
         * @param {number} ts
         * @return {TimestampType}
         * @constructor
         */
        public static CheckTimeStampType(ts:number) {
            return ts<9999999999 ? TimestampType.TS_SECOND : TimestampType.TS_MILLISECOND;
        }


        /**
         * static : 将时间戳转换成moment对象(支持秒和毫秒)
         * @param {number} ts
         * @return {moment.Moment}
         * @constructor
         */
        protected static ParseMomentFromNumber(ts:number) {
            return DateTimeParser.CheckTimeStampType(ts)==TimestampType.TS_MILLISECOND ? moment(ts) : moment.unix(ts);
        }

        /**
         * DateTimeParse构造函数
         * @param {DTParam} dt : 参数值
         * @desc : 参数值支持以下变量类型
         *  1) 时间戳(秒/毫秒)
         *  2) 时间类型字符串 , 如 "2018-01-10 10:00" / "2018-01-22T06:11:25.67" / "JUL 12 2018 12:00 GMT+0800"
         *  3) Date类型对象, 如 new Date()
         *  4) DateTimeParser对象，
         *  5) 空值, 空值的情况下返回当前时间
         */
        public constructor(dt?: DTParam) {
            if (!dt) {
                this.momentObject = moment();
                return;
            }

            if(dt instanceof DateTimeParser) {
                this.momentObject = dt.momentObject;
                return;
            }

            if (moment.isMoment(dt)) {
                this.momentObject = dt;
            } else if(_.isString(dt)) {
                this.momentObject = moment(new Date(dt));
            } else if (_.isDate(dt)) {
                this.momentObject = moment(dt);
            } else if (_.isNumber(dt)) {
                this.momentObject = DateTimeParser.ParseMomentFromNumber(dt as number);
            } else {
                this.momentObject = moment();
            }
        }



        /**
         * 时间日期相加操作
         * @param {moment.DurationInputArg1} amount
         * @param {moment.DurationInputArg2} unit
         * @return {DateTimeParser}
         */
        public add(amount?: DurationInputArg1, unit?: DurationInputArg2) {
            return new DateTimeParser(this.momentObject.add(amount,unit));
        }


        /**
         * 时间日期相减操作
         * @param {DurationInputArg1} amount
         * @param {DurationInputArg2} unit
         * @return {DateTimeParser}
         */
        public subtract(amount?: DurationInputArg1, unit?: DurationInputArg2) {
            return new DateTimeParser(this.momentObject.subtract(amount,unit));
        }

        /**
         * 将一个对象加几天
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public addDays(amount? :  DurationInputArg1) {
            return this.add(amount,'days');
        }

        /**
         * 将一个对象减几天
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public subDays(amount? : DurationInputArg1) {
            return this.subtract(amount,'days');
        }


        /**
         * 加月
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public addMonth(amount? :  DurationInputArg1) {
            return this.add(amount,'months');
        }

        /**
         * 减月
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public subMonth(amount? :  DurationInputArg1) {
            return this.subtract(amount, 'months');
        }

        /**
         * 加年
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public addYear(amount? :  DurationInputArg1) {
            return this.add(amount,'years');
        }

        /**
         * 减年
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public subYear(amount? :  DurationInputArg1) {
            return this.subtract(amount, 'years');
        }

        /**
         * 加小时
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public addHour(amount? :  DurationInputArg1) {
            return this.add(amount,'hours');
        }

        /**
         * 减小时
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public subHour(amount? :  DurationInputArg1) {
            return this.subtract(amount, 'hours');
        }


        /**
         * 加分钟
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public addMinute(amount? :  DurationInputArg1) {
            return this.add(amount,'minutes');
        }

        /**
         * 减分钟
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        public subMinute(amount? :  DurationInputArg1) {
            return this.subtract(amount, 'minutes');
        }


        /**
         * 以下以end/start开头的所有操作函数是用来计算日期的开头或结尾
         * endOfDay : 是计算一个日期对象当天最开始的时间是多少
         * endofMonth : 是计算一个日期对象当月最开始的时间是多少
         * endofYear : 是计算一个日期对象当年结束的时间是多少
         * @return {DateTimeParser}
         */
        public endOfDay() {return new DateTimeParser(this.momentObject.endOf("day")); }
        public startOfDay() {return new DateTimeParser(this.momentObject.startOf("day"));}
        public endOfMonth() {return new DateTimeParser(this.momentObject.endOf("month"));}
        public startOfMonth() {return new DateTimeParser(this.momentObject.startOf("month"));}
        public endOfYear() { return new DateTimeParser(this.momentObject.endOf("year"));}
        public startOfYear() { return new DateTimeParser(this.momentObject.startOf("year"));}
        public endOfQuarter() { return new DateTimeParser(this.momentObject.endOf("quarter"));}
        public startOfQuarter() { return new DateTimeParser(this.momentObject.startOf("quarter"));}
        public endOfWeek() { return new DateTimeParser(this.momentObject.endOf("week"));}
        public startOfWeek() { return new DateTimeParser(this.momentObject.startOf("week"));}
        public endOfHour() { return new DateTimeParser(this.momentObject.endOf("hour"));}
        public startOfHour() { return new DateTimeParser(this.momentObject.startOf("hour"));}
        public endOfMinute() { return new DateTimeParser(this.momentObject.endOf("minute"));}
        public startOfMinute() { return new DateTimeParser(this.momentObject.startOf("minute"));}


        /**
         * 比较两个时间对象的差分
         * unit参数是差分的基准，可以是"month","day","year","minute","hour"...
         * @param {DTParam} dt
         * @param {DurationInputArg2} unit
         * @return {any}
         */
        public toDiff(dt:DTParam, unit?: DurationInputArg2) {
            let otherObj = null;
            if(dt instanceof DateTimeParser) {
                otherObj = dt;
            } else {
                otherObj = new DateTimeParser(dt);
            }

            return this.momentObject.diff(otherObj.momentObject,unit);
        }

        /**
         * 两个日期对象上日的差分
         * 备注 : toDiffXXX 函数都是返回两个日期对象相隔的差分值
         * @param {DTParam} dt
         * @return {any}
         */
        public toDiffDay(dt:DTParam) : number { return this.toDiff(dt,'day'); }
        public toDiffMonth(dt:DTParam) : number {
            // return this.toDiff(dt,'month');
            let otherObj = null;
            if(dt instanceof DateTimeParser) {
                otherObj = dt;
            } else {
                otherObj = new DateTimeParser(dt);
            }

            return moment(this.momentObject.format("YYYY-MM")).diff(
                moment(otherObj.momentObject.format("YYYY-MM")),
                "month");
        }
        public toDiffYear(dt:DTParam) : number { return this.toDiff(dt,'year'); }
        public toDiffWeek(dt:DTParam) : number { return this.toDiff(dt,'week'); }
        public toDiffQuarter(dt:DTParam) : number { return this.toDiff(dt,'quarter'); }
        public toDiffHour(dt:DTParam) : number { return this.toDiff(dt,'hour'); }
        public toDiffMinute(dt:DTParam) : number { return this.toDiff(dt,'minute'); }
        public toDiffSecond(dt:DTParam) : number { return this.toDiff(dt,'second'); }
        public toDiffMilliSecond(dt:DTParam) : number { return this.toDiff(dt,'millisecond'); }


        /**
         * 将日期对象进行格式化,默认为"YYYY-MM-DD HH:mm:SS"
         * @param {string} fmt : 格式化参数
         * @return {string}
         */
        public toFormat(fmt:string=null) : string {
            return fmt ? this.momentObject.format(fmt) : this.momentObject.format(DTFormatType.YMDHMS);
        }

        /**
         * 将本日期对象转换为moment类型对象
         * @return {Moment}
         */
        public toMomentObject() : Moment {
            return this.momentObject;
        }

        public toYear() :number {
            return this.momentObject.year();
        }

        public toMonth() :number {
            return this.momentObject.month();
        }

        public toDay() : number {
            return this.momentObject.date();
        }

        public toDayInWeek() : number {
            return this.momentObject.day();
        }

        public toHour() : number {
            return this.momentObject.hour();
        }

        public toMinute() : number {
            return this.momentObject.minute();
        }

        public toSecond() : number {
            return this.momentObject.second();
        }

        public toMilliSecond() : number {
            return this.momentObject.millisecond();
        }

        public toUnixTimestamp() : number {
            return this.momentObject.unix();
        }

        /**
         * 为1970-1-1那一天距此日期对象的天数
         * @return {number}
         */
        public toInDays() : number {
            return this.momentObject.diff(moment(BEGIN_DATE),DTItemKey.days);
        }
    }


    /**
     * 实例化DateTimeParser类
     * @param {QinggerLibDateTime.DTParam} dt
     * @return {QinggerLibDateTime.DateTimeParser}
     */
    export function dateTimeParse(dt?:DTParam) : DateTimeParser {
        return  new DateTimeParser(dt);
    }

}