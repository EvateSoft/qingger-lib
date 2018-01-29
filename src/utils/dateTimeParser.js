"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:56
 */
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment');
const _ = require("lodash");
var QinggerLibDateTime;
(function (QinggerLibDateTime) {
    let TimestampType;
    (function (TimestampType) {
        TimestampType[TimestampType["TS_SECOND"] = 0] = "TS_SECOND";
        TimestampType[TimestampType["TS_MILLISECOND"] = 1] = "TS_MILLISECOND";
    })(TimestampType = QinggerLibDateTime.TimestampType || (QinggerLibDateTime.TimestampType = {}));
    /**
     * 定义日期的开始日期基准
     * @type {string}
     */
    QinggerLibDateTime.BEGIN_DATE = '1970-01-01';
    /**
     * 时间格式化方式
     */
    let DTFormatType;
    (function (DTFormatType) {
        DTFormatType["YMDHMS"] = "YYYY-MM-DD HH:mm:ss";
        DTFormatType["YMD"] = "YYYY-MM-DD";
        DTFormatType["HMS"] = "HH:mm:ss";
    })(DTFormatType = QinggerLibDateTime.DTFormatType || (QinggerLibDateTime.DTFormatType = {}));
    /**
     * moment库中使用到的一些常量定义
     */
    let DTItemKey;
    (function (DTItemKey) {
        DTItemKey["years"] = "years";
        DTItemKey["quarters"] = "quarters";
        DTItemKey["months"] = "months";
        DTItemKey["weeks"] = "weeks";
        DTItemKey["days"] = "days";
        DTItemKey["hours"] = "hours";
        DTItemKey["minutes"] = "minutes";
        DTItemKey["seconds"] = "seconds";
        DTItemKey["milliseconds"] = "milliseconds";
    })(DTItemKey = QinggerLibDateTime.DTItemKey || (QinggerLibDateTime.DTItemKey = {}));
    /**
     * Qingger-DateTimeParser处理日期时间类
     */
    class DateTimeParser {
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
        constructor(dt) {
            /**
             * moment对象实例
             * @type {Moment}
             */
            this.momentObject = null;
            if (!dt) {
                this.momentObject = moment();
                return;
            }
            if (dt instanceof DateTimeParser) {
                this.momentObject = dt.momentObject;
                return;
            }
            if (moment.isMoment(dt)) {
                this.momentObject = dt;
            }
            else if (_.isString(dt)) {
                this.momentObject = moment(new Date(dt));
            }
            else if (_.isDate(dt)) {
                this.momentObject = moment(dt);
            }
            else if (_.isNumber(dt)) {
                this.momentObject = DateTimeParser.ParseMomentFromNumber(dt);
            }
            else {
                this.momentObject = moment();
            }
        }
        /**
         * static : 检查ts变量计数值单位是秒还是毫秒
         * @param {number} ts
         * @return {TimestampType}
         * @constructor
         */
        static CheckTimeStampType(ts) {
            return ts < 9999999999 ? TimestampType.TS_SECOND : TimestampType.TS_MILLISECOND;
        }
        /**
         * static : 将时间戳转换成moment对象(支持秒和毫秒)
         * @param {number} ts
         * @return {moment.Moment}
         * @constructor
         */
        static ParseMomentFromNumber(ts) {
            return DateTimeParser.CheckTimeStampType(ts) == TimestampType.TS_MILLISECOND ? moment(ts) : moment.unix(ts);
        }
        /**
         * 时间日期相加操作
         * @param {moment.DurationInputArg1} amount
         * @param {moment.DurationInputArg2} unit
         * @return {DateTimeParser}
         */
        add(amount, unit) {
            return new DateTimeParser(this.momentObject.add(amount, unit));
        }
        /**
         * 时间日期相减操作
         * @param {DurationInputArg1} amount
         * @param {DurationInputArg2} unit
         * @return {DateTimeParser}
         */
        subtract(amount, unit) {
            return new DateTimeParser(this.momentObject.subtract(amount, unit));
        }
        /**
         * 将一个对象加几天
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        addDays(amount) {
            return this.add(amount, 'days');
        }
        /**
         * 将一个对象减几天
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        subDays(amount) {
            return this.subtract(amount, 'days');
        }
        /**
         * 加月
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        addMonth(amount) {
            return this.add(amount, 'months');
        }
        /**
         * 减月
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        subMonth(amount) {
            return this.subtract(amount, 'months');
        }
        /**
         * 加年
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        addYear(amount) {
            return this.add(amount, 'years');
        }
        /**
         * 减年
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        subYear(amount) {
            return this.subtract(amount, 'years');
        }
        /**
         * 加小时
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        addHour(amount) {
            return this.add(amount, 'hours');
        }
        /**
         * 减小时
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        subHour(amount) {
            return this.subtract(amount, 'hours');
        }
        /**
         * 加分钟
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        addMinute(amount) {
            return this.add(amount, 'minutes');
        }
        /**
         * 减分钟
         * @param {DurationInputArg1} amount
         * @return {DateTimeParser}
         */
        subMinute(amount) {
            return this.subtract(amount, 'minutes');
        }
        /**
         * 以下以end/start开头的所有操作函数是用来计算日期的开头或结尾
         * endOfDay : 是计算一个日期对象当天最开始的时间是多少
         * endofMonth : 是计算一个日期对象当月最开始的时间是多少
         * endofYear : 是计算一个日期对象当年结束的时间是多少
         * @return {DateTimeParser}
         */
        endOfDay() { return new DateTimeParser(this.momentObject.endOf("day")); }
        startOfDay() { return new DateTimeParser(this.momentObject.startOf("day")); }
        endOfMonth() { return new DateTimeParser(this.momentObject.endOf("month")); }
        startOfMonth() { return new DateTimeParser(this.momentObject.startOf("month")); }
        endOfYear() { return new DateTimeParser(this.momentObject.endOf("year")); }
        startOfYear() { return new DateTimeParser(this.momentObject.startOf("year")); }
        endOfQuarter() { return new DateTimeParser(this.momentObject.endOf("quarter")); }
        startOfQuarter() { return new DateTimeParser(this.momentObject.startOf("quarter")); }
        endOfWeek() { return new DateTimeParser(this.momentObject.endOf("week")); }
        startOfWeek() { return new DateTimeParser(this.momentObject.startOf("week")); }
        endOfHour() { return new DateTimeParser(this.momentObject.endOf("hour")); }
        startOfHour() { return new DateTimeParser(this.momentObject.startOf("hour")); }
        endOfMinute() { return new DateTimeParser(this.momentObject.endOf("minute")); }
        startOfMinute() { return new DateTimeParser(this.momentObject.startOf("minute")); }
        /**
         * 比较两个时间对象的差分
         * unit参数是差分的基准，可以是"month","day","year","minute","hour"...
         * @param {DTParam} dt
         * @param {DurationInputArg2} unit
         * @return {any}
         */
        toDiff(dt, unit) {
            let otherObj = null;
            if (dt instanceof DateTimeParser) {
                otherObj = dt;
            }
            else {
                otherObj = new DateTimeParser(dt);
            }
            return this.momentObject.diff(otherObj.momentObject, unit);
        }
        /**
         * 两个日期对象上日的差分
         * 备注 : toDiffXXX 函数都是返回两个日期对象相隔的差分值
         * @param {DTParam} dt
         * @return {any}
         */
        toDiffDay(dt) { return this.toDiff(dt, 'day'); }
        toDiffMonth(dt) {
            // return this.toDiff(dt,'month');
            let otherObj = null;
            if (dt instanceof DateTimeParser) {
                otherObj = dt;
            }
            else {
                otherObj = new DateTimeParser(dt);
            }
            return moment(this.momentObject.format("YYYY-MM")).diff(moment(otherObj.momentObject.format("YYYY-MM")), "month");
        }
        toDiffYear(dt) { return this.toDiff(dt, 'year'); }
        toDiffWeek(dt) { return this.toDiff(dt, 'week'); }
        toDiffQuarter(dt) { return this.toDiff(dt, 'quarter'); }
        toDiffHour(dt) { return this.toDiff(dt, 'hour'); }
        toDiffMinute(dt) { return this.toDiff(dt, 'minute'); }
        toDiffSecond(dt) { return this.toDiff(dt, 'second'); }
        toDiffMilliSecond(dt) { return this.toDiff(dt, 'millisecond'); }
        /**
         * 将日期对象进行格式化,默认为"YYYY-MM-DD HH:mm:SS"
         * @param {string} fmt : 格式化参数
         * @return {string}
         */
        toFormat(fmt = null) {
            return fmt ? this.momentObject.format(fmt) : this.momentObject.format(DTFormatType.YMDHMS);
        }
        /**
         * 将本日期对象转换为moment类型对象
         * @return {Moment}
         */
        toMomentObject() {
            return this.momentObject;
        }
        toYear() {
            return this.momentObject.year();
        }
        toMonth() {
            return this.momentObject.month();
        }
        toDay() {
            return this.momentObject.date();
        }
        toDayInWeek() {
            return this.momentObject.day();
        }
        toHour() {
            return this.momentObject.hour();
        }
        toMinute() {
            return this.momentObject.minute();
        }
        toSecond() {
            return this.momentObject.second();
        }
        toMilliSecond() {
            return this.momentObject.millisecond();
        }
        toUnixTimestamp() {
            return this.momentObject.unix();
        }
        /**
         * 为1970-1-1那一天距此日期对象的天数
         * @return {number}
         */
        toInDays() {
            return this.momentObject.diff(moment(QinggerLibDateTime.BEGIN_DATE), DTItemKey.days);
        }
    }
    QinggerLibDateTime.DateTimeParser = DateTimeParser;
    /**
     * 实例化DateTimeParser类
     * @param {QinggerLibDateTime.DTParam} dt
     * @return {QinggerLibDateTime.DateTimeParser}
     */
    function dateTimeParse(dt) {
        return new DateTimeParser(dt);
    }
    QinggerLibDateTime.dateTimeParse = dateTimeParse;
})(QinggerLibDateTime = exports.QinggerLibDateTime || (exports.QinggerLibDateTime = {}));
