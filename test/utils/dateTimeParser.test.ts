/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/28
 * Time: 22:11
 */


import { suite, test, slow} from "mocha-typescript";
import {expect} from "chai";
import {QinggerLibDateTime} from "../../library/utils/dateTimeParser";
import dateTimeParse = QinggerLibDateTime.dateTimeParse;
import moment = require("moment");
import DTItemKey = QinggerLibDateTime.DTItemKey;

function formatDate(dateObj:Date,fmt:string) { //author: meizz
    let o = {
        "M+" : dateObj.getMonth()+1,                 //月份
        "d+" : dateObj.getDate(),                    //日
        "h+" : dateObj.getHours(),                   //小时
        "m+" : dateObj.getMinutes(),                 //分
        "s+" : dateObj.getSeconds(),                 //秒
        "q+" : Math.floor((dateObj.getMonth()+3)/3), //季度
        "S"  : dateObj.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (dateObj.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

suite("DateTimeParser测试",function(){
    let dtNow = null;
    let dtDateNow = null;
    let dt2018010106, dt20171231171000,dtMoment20170110,dtTimestamp20180111235959,dtNowCopy = null;
    let dateNowObj = new Date();
    before(function () {
        dtNow = dateTimeParse();
        dtDateNow = dateTimeParse(dateNowObj);
        dt2018010106 = dateTimeParse('2018-01-01 06:00');
        dt20171231171000 = dateTimeParse('2017-12-31 17:10:00');
        dtMoment20170110 = dateTimeParse(moment('2017-01-10'));
        dtTimestamp20180111235959 = dateTimeParse(1515686399);
        dtNowCopy = dateTimeParse(dtNow);

    });

    suite("1.dateTimeParser函数构造测试:",function(){

        it("字符串,Date,moment,timestamp构造化:",function () {
            expect(dtNow).to.be.an.instanceof(QinggerLibDateTime.DateTimeParser);
            expect(dtDateNow).to.be.an.instanceof(QinggerLibDateTime.DateTimeParser);
        });
    });


    suite("2.dateTimeParser函数测试:",function () {

        it("format函数测试:",function () {
            expect(dtNow.toFormat("YYYY-MM-DD HH:mm")).to.be.eq(dtDateNow.toFormat("YYYY-MM-DD HH:mm"));

            let dateNowFmt = formatDate(dateNowObj,"yyyy-MM-dd hh:mm");
            expect(dtNow.toFormat("YYYY-MM-DD HH:mm")).to.be.eq(dateNowFmt);

            expect(dt2018010106.toFormat()).eq("2018-01-01 06:00:00");
            expect(dtMoment20170110.toFormat()).eq("2017-01-10 00:00:00");

            expect(dtTimestamp20180111235959.toFormat("HH:mm:ss")).eq('23:59:59');
        });


        it("add/subtract日期加减函数测试",function () {
            // 因add/subtract操作会改变自身，所以需要额外赋值变量

            let tmp4dt2018010106 = dateTimeParse(dt2018010106);
            let subUnitForMonth = tmp4dt2018010106.subUnit(DTItemKey.months);
            expect(subUnitForMonth(12).toYear()).eq(2017);


            let tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.addDays(3).toFormat()).eq("2018-01-03 17:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.subDays(3).toFormat()).eq("2017-12-28 17:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.addMonth(2).toFormat()).eq("2018-02-28 17:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.subMonth(2).toFormat()).eq("2017-10-31 17:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.addYear(1).toFormat()).eq("2018-12-31 17:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.subYear(1).toFormat()).eq("2016-12-31 17:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.addHour(3).toFormat()).eq("2017-12-31 20:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.subHour(3).toFormat()).eq("2017-12-31 14:10:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.addMinute(3).toFormat()).eq("2017-12-31 17:13:00");
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.subMinute(60).toFormat()).eq("2017-12-31 16:10:00");
        });


        it("end/start日期函数测试",function(){
            // end/start操作会改变日期数据，所以需要额外赋值变量
            let tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.startOfDay().toFormat()).eq('2017-12-31 00:00:00');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.endOfDay().toFormat()).eq('2017-12-31 23:59:59');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.startOfMonth().toFormat()).eq('2017-12-01 00:00:00');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.endOfMonth().toFormat()).eq('2017-12-31 23:59:59');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.startOfYear().toFormat()).eq('2017-01-01 00:00:00');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.endOfYear().toFormat()).eq('2017-12-31 23:59:59');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.startOfQuarter().toFormat()).eq('2017-10-01 00:00:00');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.endOfQuarter().toFormat()).eq('2017-12-31 23:59:59');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.startOfHour().toFormat()).eq('2017-12-31 17:00:00');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.endOfHour().toFormat()).eq('2017-12-31 17:59:59');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.startOfMinute().toFormat()).eq('2017-12-31 17:10:00');
            tmpdt20171231171000 = dateTimeParse(dt20171231171000);
            expect(tmpdt20171231171000.endOfMinute().toFormat()).eq('2017-12-31 17:10:59');
        });


        it("diff日期间隔计算测试",function () {
            // 2018-01-11 23:59:59
            // expect(dtTimestamp20180111235959.toDiffDay('2018-01-20')).eq(9);
            // expect(dtTimestamp20180111235959.toDiffDay('2018-01-01')).eq(-10);
        });

        it ("toXXX函数测试",function () {
            // 2018-01-11 23:59:59
            expect(dtTimestamp20180111235959.toMomentObject()).to.be.instanceof(moment);
            expect(dtTimestamp20180111235959.toDay()).eq(11);
            expect(dtTimestamp20180111235959.toMonth()).eq(1);
            expect(dtTimestamp20180111235959.toDayInWeek()).eq(4); // 周四
            expect(dtTimestamp20180111235959.toHour()).eq(23);
            expect(dtTimestamp20180111235959.toMinute()).eq(59);
            expect(dtTimestamp20180111235959.toSecond()).eq(59);
            expect(dtTimestamp20180111235959.toUnixTimestamp()).eq(1515686399);
            expect(dtTimestamp20180111235959.toInDays()).eq(17542);
        });
    });

});