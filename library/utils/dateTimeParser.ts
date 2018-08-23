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
            return (ts<9999999999 && ts>-60000000000) ? TimestampType.TS_SECOND : TimestampType.TS_MILLISECOND;
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
                this.momentObject = moment(dt.momentObject);
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
         * addXX的高阶函数
         * @param {QinggerLibDateTime.DTItemKey} unit
         * @return {(amount?: DurationInputArg1) => DateTimeParser}
         */
        public addUnit(unit:DTItemKey) {
            let self = this;
            return function (amount? : DurationInputArg1) {
                return new DateTimeParser(self.momentObject.add(amount,unit));
            }
        }

        /**
         * subXX的高阶函数
         * @param {QinggerLibDateTime.DTItemKey} unit
         * @return {(amount?: DurationInputArg1) => DateTimeParser}
         */
        public subUnit(unit:DTItemKey) {
            let self = this;
            return function subAmount(amount? : DurationInputArg1) {
                return new DateTimeParser(self.momentObject.subtract(amount,unit));
            }
        }

        /**
         * add("day")的偏函数
         * @type {(amount?: DurationInputArg1) => DateTimeParser}
         */
        public addDays = this.addUnit(DTItemKey.days);
        public addMonth = this.addUnit(DTItemKey.months);
        public addYear = this.addUnit(DTItemKey.years);
        public addHour = this.addUnit(DTItemKey.hours);
        public addMinute = this.addUnit(DTItemKey.minutes);


        public subDays = this.subUnit(DTItemKey.days);
        public subMonth = this.subUnit(DTItemKey.months);
        public subYear = this.subUnit(DTItemKey.years);
        public subHour = this.subUnit(DTItemKey.hours);
        public subMinute = this.subUnit(DTItemKey.minutes);

        // /**
        //  * 将一个对象加几天
        //  * @param {DurationInputArg1} amount
        //  * @return {DateTimeParser}
        //  */
        // public addDays(amount? :  DurationInputArg1) {
        //     // return this.addUnit(DTItemKey.days)(amount);
        //     // return this.add(amount,'days');
        // }



        /**
         * 以下以end/start开头的所有操作函数是用来计算日期的开头或结尾
         * endOfDay : 是计算一个日期对象当天最开始的时间是多少
         * endofMonth : 是计算一个日期对象当月最开始的时间是多少
         * endofYear : 是计算一个日期对象当年结束的时间是多少
         * @return {DateTimeParser}
         */
        public endOfDay() {
            this.momentObject.endOf("day");
            return this;
        }

        public startOfDay() {this.momentObject.startOf("day"); return this;}
        public endOfMonth() {this.momentObject.endOf("month"); return this;}
        public startOfMonth() {this.momentObject.startOf("month"); return this;}
        public endOfYear() { this.momentObject.endOf("year"); return this;}
        public startOfYear() { this.momentObject.startOf("year"); return this;}
        public endOfQuarter() { this.momentObject.endOf("quarter"); return this;}
        public startOfQuarter() { this.momentObject.startOf("quarter"); return this;}
        public endOfWeek() { this.momentObject.endOf("week"); return this;}
        public startOfWeek() { this.momentObject.startOf("week"); return this;}
        public endOfHour() { this.momentObject.endOf("hour"); return this;}
        public startOfHour() { this.momentObject.startOf("hour"); return this;}
        public endOfMinute() { this.momentObject.endOf("minute"); return this;}
        public startOfMinute() { this.momentObject.startOf("minute"); return this;}


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

        /**
         * 获得月份，对于moment来说，月份的索引是0-11,对于DateParser来说，索引是1-12
         * @return {number}
         */
        public toMonth() :number {
            return this.momentObject.month()+1;
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