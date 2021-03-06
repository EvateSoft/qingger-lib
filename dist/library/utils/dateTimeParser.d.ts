/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:56
 */
import { Moment, DurationInputArg1, DurationInputArg2 } from "moment";
export declare namespace QinggerLibDateTime {
    type DTParam = DateTimeParser | Moment | string | number | Date | any;
    enum TimestampType {
        TS_SECOND = 0,
        TS_MILLISECOND = 1
    }
    /**
     * 定义日期的开始日期基准
     * @type {string}
     */
    const BEGIN_DATE = "1970-01-01";
    /**
     * 时间格式化方式
     */
    enum DTFormatType {
        YMDHMS = "YYYY-MM-DD HH:mm:ss",
        YMD = "YYYY-MM-DD",
        HMS = "HH:mm:ss"
    }
    /**
     * moment库中使用到的一些常量定义
     */
    enum DTItemKey {
        years = "years",
        quarters = "quarters",
        months = "months",
        weeks = "weeks",
        days = "days",
        hours = "hours",
        minutes = "minutes",
        seconds = "seconds",
        milliseconds = "milliseconds"
    }
    /**
     * Qingger-DateTimeParser处理日期时间类
     */
    class DateTimeParser {
        /**
         * moment对象实例
         * @type {Moment}
         */
        protected momentObject: any;
        /**
         * static : 检查ts变量计数值单位是秒还是毫秒
         * @param {number} ts
         * @return {TimestampType}
         * @constructor
         */
        static CheckTimeStampType(ts: number): TimestampType;
        /**
         * static : 将时间戳转换成moment对象(支持秒和毫秒)
         * @param {number} ts
         * @return {moment.Moment}
         * @constructor
         */
        protected static ParseMomentFromNumber(ts: number): any;
        /**
         * DateTimeParse构造函数
         * @param {DTParam} dt : 参数值
         * @desc : 参数值支持以下变量类型
         *  1) 时间戳(秒/毫秒), 备注：现在只支持秒数,而不支持毫秒
         *  2) 时间类型字符串 , 如 "2018-01-10 10:00" / "2018-01-22T06:11:25.67" / "JUL 12 2018 12:00 GMT+0800"
         *  3) Date类型对象, 如 new Date()
         *  4) DateTimeParser对象，
         *  5) 空值, 空值的情况下返回当前时间
         */
        constructor(dt?: DTParam);
        /**
         * addXX的高阶函数
         * @param {QinggerLibDateTime.DTItemKey} unit
         * @return {(amount?: DurationInputArg1) => DateTimeParser}
         */
        addUnit(unit: DTItemKey): (amount?: DurationInputArg1) => DateTimeParser;
        /**
         * subXX的高阶函数
         * @param {QinggerLibDateTime.DTItemKey} unit
         * @return {(amount?: DurationInputArg1) => DateTimeParser}
         */
        subUnit(unit: DTItemKey): (amount?: DurationInputArg1) => DateTimeParser;
        /**
         * add("day")的偏函数
         * @type {(amount?: DurationInputArg1) => DateTimeParser}
         */
        addDays: (amount?: DurationInputArg1) => DateTimeParser;
        addMonth: (amount?: DurationInputArg1) => DateTimeParser;
        addYear: (amount?: DurationInputArg1) => DateTimeParser;
        addHour: (amount?: DurationInputArg1) => DateTimeParser;
        addMinute: (amount?: DurationInputArg1) => DateTimeParser;
        subDays: (amount?: DurationInputArg1) => DateTimeParser;
        subMonth: (amount?: DurationInputArg1) => DateTimeParser;
        subYear: (amount?: DurationInputArg1) => DateTimeParser;
        subHour: (amount?: DurationInputArg1) => DateTimeParser;
        subMinute: (amount?: DurationInputArg1) => DateTimeParser;
        /**
         * 以下以end/start开头的所有操作函数是用来计算日期的开头或结尾
         * endOfDay : 是计算一个日期对象当天最开始的时间是多少
         * endofMonth : 是计算一个日期对象当月最开始的时间是多少
         * endofYear : 是计算一个日期对象当年结束的时间是多少
         * @return {DateTimeParser}
         */
        endOfDay(): this;
        startOfDay(): this;
        endOfMonth(): this;
        startOfMonth(): this;
        endOfYear(): this;
        startOfYear(): this;
        endOfQuarter(): this;
        startOfQuarter(): this;
        endOfWeek(): this;
        startOfWeek(): this;
        endOfHour(): this;
        startOfHour(): this;
        endOfMinute(): this;
        startOfMinute(): this;
        /**
         * 比较两个时间对象的差分
         * unit参数是差分的基准，可以是"month","day","year","minute","hour"...
         * @param {DTParam} dt
         * @param {DurationInputArg2} unit
         * @return {any}
         */
        toDiff(dt: DTParam, unit?: DurationInputArg2): any;
        /**
         * 两个日期对象上日的差分
         * 备注 : toDiffXXX 函数都是返回两个日期对象相隔的差分值
         * @param {DTParam} dt
         * @return {any}
         */
        toDiffDay(dt: DTParam): number;
        toDiffMonth(dt: DTParam): number;
        toDiffYear(dt: DTParam): number;
        toDiffWeek(dt: DTParam): number;
        toDiffQuarter(dt: DTParam): number;
        toDiffHour(dt: DTParam): number;
        toDiffMinute(dt: DTParam): number;
        toDiffSecond(dt: DTParam): number;
        toDiffMilliSecond(dt: DTParam): number;
        /**
         * 将日期对象进行格式化,默认为"YYYY-MM-DD HH:mm:SS"
         * @param {string} fmt : 格式化参数
         * @return {string}
         */
        toFormat(fmt?: string): string;
        /**
         * 将本日期对象转换为moment类型对象
         * @return {Moment}
         */
        toMomentObject(): Moment;
        toYear(): number;
        /**
         * 获得月份，对于moment来说，月份的索引是0-11,对于DateParser来说，索引是1-12
         * @return {number}
         */
        toMonth(): number;
        toDay(): number;
        toDayInWeek(): number;
        toHour(): number;
        toMinute(): number;
        toSecond(): number;
        toMilliSecond(): number;
        toUnixTimestamp(): number;
        /**
         * 为1970-1-1那一天距此日期对象的天数
         * @return {number}
         */
        toInDays(): number;
    }
    /**
     * 实例化DateTimeParser类
     * @param {QinggerLibDateTime.DTParam} dt
     * @return {QinggerLibDateTime.DateTimeParser}
     */
    function dateTimeParse(dt?: DTParam): DateTimeParser;
}
