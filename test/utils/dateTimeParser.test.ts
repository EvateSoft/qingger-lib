/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/28
 * Time: 22:11
 */


import { suite, test, slow} from "mocha-typescript";
import {expect} from "chai";
import {QinggerLibDateTime} from "../../src/utils/dateTimeParser";
import dateTimeParse = QinggerLibDateTime.dateTimeParse;
import moment = require("moment");

suite("DateTimeParser测试",function(){
    let dtNow = null;
    let dtDateNow = null;
    let dt2018010106, dt20171231171000,dtMoment20180110,dtTimestamp20180111235959,dtNowCopy = null;
    let dateNowObj = new Date();
    before(function () {
        dtNow = dateTimeParse();
        dtDateNow = dateTimeParse(dateNowObj);
        dt2018010106 = dateTimeParse('2018-01-01 06');
        dt20171231171000 = dateTimeParse('2017-12-31 17:10:00');
        dtMoment20180110 = dateTimeParse(moment('2017-01-10'));
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
            let strNow1 = dtNow.toFormat();
            let strNow2 = dtDateNow.toFormat();
            expect(strNow1).to.be.eq(strNow2);
        });

    });

});