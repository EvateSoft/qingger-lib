"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/28
 * Time: 22:11
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const dateTimeParser_1 = require("../../src/utils/dateTimeParser");
var dateTimeParse = dateTimeParser_1.QinggerLibDateTime.dateTimeParse;
const moment = require("moment");
mocha_typescript_1.suite("DateTimeParser测试", function () {
    let dtNow = null;
    let dtDateNow = null;
    let dt2018010106, dt20171231171000, dtMoment20180110, dtTimestamp20180111235959, dtNowCopy = null;
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
    mocha_typescript_1.suite("1.dateTimeParser函数构造测试:", function () {
        it("字符串,Date,moment,timestamp构造化:", function () {
            chai_1.expect(dtNow).to.be.an.instanceof(dateTimeParser_1.QinggerLibDateTime.DateTimeParser);
            chai_1.expect(dtDateNow).to.be.an.instanceof(dateTimeParser_1.QinggerLibDateTime.DateTimeParser);
        });
    });
    mocha_typescript_1.suite("2.dateTimeParser函数测试:", function () {
        it("format函数测试:", function () {
            let strNow1 = dtNow.toFormat();
            let strNow2 = dtDateNow.toFormat();
            chai_1.expect(strNow1).to.be.eq(strNow2);
        });
    });
});
