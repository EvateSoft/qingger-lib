"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:56
 */
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require('moment');
var _ = require("lodash");
var QinggerLibDateTime;
(function (QinggerLibDateTime) {
    var TimestampType;
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
    var DTFormatType;
    (function (DTFormatType) {
        DTFormatType["YMDHMS"] = "YYYY-MM-DD HH:mm:ss";
        DTFormatType["YMD"] = "YYYY-MM-DD";
        DTFormatType["HMS"] = "HH:mm:ss";
    })(DTFormatType = QinggerLibDateTime.DTFormatType || (QinggerLibDateTime.DTFormatType = {}));
    /**
     * moment库中使用到的一些常量定义
     */
    var DTItemKey;
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
    var DateTimeParser = /** @class */ (function () {
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
        function DateTimeParser(dt) {
            /**
             * moment对象实例
             * @type {Moment}
             */
            this.momentObject = null;
            /**
             * add("day")的偏函数
             * @type {(amount?: DurationInputArg1) => DateTimeParser}
             */
            this.addDays = this.addUnit(DTItemKey.days);
            this.addMonth = this.addUnit(DTItemKey.months);
            this.addYear = this.addUnit(DTItemKey.years);
            this.addHour = this.addUnit(DTItemKey.hours);
            this.addMinute = this.addUnit(DTItemKey.minutes);
            this.subDays = this.subUnit(DTItemKey.days);
            this.subMonth = this.subUnit(DTItemKey.months);
            this.subYear = this.subUnit(DTItemKey.years);
            this.subHour = this.subUnit(DTItemKey.hours);
            this.subMinute = this.subUnit(DTItemKey.minutes);
            if (!dt) {
                this.momentObject = moment();
                return;
            }
            if (dt instanceof DateTimeParser) {
                this.momentObject = moment(dt.momentObject);
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
        DateTimeParser.CheckTimeStampType = function (ts) {
            if (ts > 9999999999 || ts < -6000000000) { // 过大的数字必然是MILLISECOND
                return TimestampType.TS_MILLISECOND;
            }
            // 除1000取余为0，则表示MILLISECOND
            if (ts % 1000 === 0) {
                return TimestampType.TS_MILLISECOND;
            }
            return TimestampType.TS_SECOND;
            // return (ts<9999999999 && ts>-60000000000) ? TimestampType.TS_SECOND : TimestampType.TS_MILLISECOND;
        };
        /**
         * static : 将时间戳转换成moment对象(支持秒和毫秒)
         * @param {number} ts
         * @return {moment.Moment}
         * @constructor
         */
        DateTimeParser.ParseMomentFromNumber = function (ts) {
            return DateTimeParser.CheckTimeStampType(ts) == TimestampType.TS_MILLISECOND ? moment(ts) : moment.unix(ts);
        };
        /**
         * addXX的高阶函数
         * @param {QinggerLibDateTime.DTItemKey} unit
         * @return {(amount?: DurationInputArg1) => DateTimeParser}
         */
        DateTimeParser.prototype.addUnit = function (unit) {
            var self = this;
            return function (amount) {
                return new DateTimeParser(self.momentObject.add(amount, unit));
            };
        };
        /**
         * subXX的高阶函数
         * @param {QinggerLibDateTime.DTItemKey} unit
         * @return {(amount?: DurationInputArg1) => DateTimeParser}
         */
        DateTimeParser.prototype.subUnit = function (unit) {
            var self = this;
            return function subAmount(amount) {
                return new DateTimeParser(self.momentObject.subtract(amount, unit));
            };
        };
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
        DateTimeParser.prototype.endOfDay = function () {
            this.momentObject.endOf("day");
            return this;
        };
        DateTimeParser.prototype.startOfDay = function () { this.momentObject.startOf("day"); return this; };
        DateTimeParser.prototype.endOfMonth = function () { this.momentObject.endOf("month"); return this; };
        DateTimeParser.prototype.startOfMonth = function () { this.momentObject.startOf("month"); return this; };
        DateTimeParser.prototype.endOfYear = function () { this.momentObject.endOf("year"); return this; };
        DateTimeParser.prototype.startOfYear = function () { this.momentObject.startOf("year"); return this; };
        DateTimeParser.prototype.endOfQuarter = function () { this.momentObject.endOf("quarter"); return this; };
        DateTimeParser.prototype.startOfQuarter = function () { this.momentObject.startOf("quarter"); return this; };
        DateTimeParser.prototype.endOfWeek = function () { this.momentObject.endOf("week"); return this; };
        DateTimeParser.prototype.startOfWeek = function () { this.momentObject.startOf("week"); return this; };
        DateTimeParser.prototype.endOfHour = function () { this.momentObject.endOf("hour"); return this; };
        DateTimeParser.prototype.startOfHour = function () { this.momentObject.startOf("hour"); return this; };
        DateTimeParser.prototype.endOfMinute = function () { this.momentObject.endOf("minute"); return this; };
        DateTimeParser.prototype.startOfMinute = function () { this.momentObject.startOf("minute"); return this; };
        /**
         * 比较两个时间对象的差分
         * unit参数是差分的基准，可以是"month","day","year","minute","hour"...
         * @param {DTParam} dt
         * @param {DurationInputArg2} unit
         * @return {any}
         */
        DateTimeParser.prototype.toDiff = function (dt, unit) {
            var otherObj = null;
            if (dt instanceof DateTimeParser) {
                otherObj = dt;
            }
            else {
                otherObj = new DateTimeParser(dt);
            }
            return this.momentObject.diff(otherObj.momentObject, unit);
        };
        /**
         * 两个日期对象上日的差分
         * 备注 : toDiffXXX 函数都是返回两个日期对象相隔的差分值
         * @param {DTParam} dt
         * @return {any}
         */
        DateTimeParser.prototype.toDiffDay = function (dt) { return this.toDiff(dt, 'day'); };
        DateTimeParser.prototype.toDiffMonth = function (dt) {
            // return this.toDiff(dt,'month');
            var otherObj = null;
            if (dt instanceof DateTimeParser) {
                otherObj = dt;
            }
            else {
                otherObj = new DateTimeParser(dt);
            }
            return moment(this.momentObject.format("YYYY-MM")).diff(moment(otherObj.momentObject.format("YYYY-MM")), "month");
        };
        DateTimeParser.prototype.toDiffYear = function (dt) { return this.toDiff(dt, 'year'); };
        DateTimeParser.prototype.toDiffWeek = function (dt) { return this.toDiff(dt, 'week'); };
        DateTimeParser.prototype.toDiffQuarter = function (dt) { return this.toDiff(dt, 'quarter'); };
        DateTimeParser.prototype.toDiffHour = function (dt) { return this.toDiff(dt, 'hour'); };
        DateTimeParser.prototype.toDiffMinute = function (dt) { return this.toDiff(dt, 'minute'); };
        DateTimeParser.prototype.toDiffSecond = function (dt) { return this.toDiff(dt, 'second'); };
        DateTimeParser.prototype.toDiffMilliSecond = function (dt) { return this.toDiff(dt, 'millisecond'); };
        /**
         * 将日期对象进行格式化,默认为"YYYY-MM-DD HH:mm:SS"
         * @param {string} fmt : 格式化参数
         * @return {string}
         */
        DateTimeParser.prototype.toFormat = function (fmt) {
            if (fmt === void 0) { fmt = null; }
            return fmt ? this.momentObject.format(fmt) : this.momentObject.format(DTFormatType.YMDHMS);
        };
        /**
         * 将本日期对象转换为moment类型对象
         * @return {Moment}
         */
        DateTimeParser.prototype.toMomentObject = function () {
            return this.momentObject;
        };
        DateTimeParser.prototype.toYear = function () {
            return this.momentObject.year();
        };
        /**
         * 获得月份，对于moment来说，月份的索引是0-11,对于DateParser来说，索引是1-12
         * @return {number}
         */
        DateTimeParser.prototype.toMonth = function () {
            return this.momentObject.month() + 1;
        };
        DateTimeParser.prototype.toDay = function () {
            return this.momentObject.date();
        };
        DateTimeParser.prototype.toDayInWeek = function () {
            return this.momentObject.day();
        };
        DateTimeParser.prototype.toHour = function () {
            return this.momentObject.hour();
        };
        DateTimeParser.prototype.toMinute = function () {
            return this.momentObject.minute();
        };
        DateTimeParser.prototype.toSecond = function () {
            return this.momentObject.second();
        };
        DateTimeParser.prototype.toMilliSecond = function () {
            return this.momentObject.millisecond();
        };
        DateTimeParser.prototype.toUnixTimestamp = function () {
            return this.momentObject.unix();
        };
        /**
         * 为1970-1-1那一天距此日期对象的天数
         * @return {number}
         */
        DateTimeParser.prototype.toInDays = function () {
            return this.momentObject.diff(moment(QinggerLibDateTime.BEGIN_DATE), DTItemKey.days);
        };
        return DateTimeParser;
    }());
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
