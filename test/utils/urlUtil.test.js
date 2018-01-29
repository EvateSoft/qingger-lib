"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 14:11
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_typescript_1 = require("mocha-typescript");
var chai_1 = require("chai");
var urlUtil_1 = require("../../library/utils/urlUtil");
var urlUtil = urlUtil_1.QinggerLibURL.urlUtil;
mocha_typescript_1.suite("URL工具类(urlUtil)测试", function () {
    var testUrl = 'http://blog.csdn.net/vbangle/article/details/5643091';
    var testUrlWithQuery = 'https://cn.bing.com/search?q=typescript+outDir&qs=n&form=QBRE';
    var testUrlWithFlags = 'localhost:7188/periodical?q=te&corpId=B2CCIRCLE#/path1/path2';
    mocha_typescript_1.suite("1.urlUtil函数构造测试:", function () {
        it("urlUtil生成的对象实例为UrlUtil类型", function () {
            chai_1.expect(urlUtil()).to.be.an.instanceof(urlUtil_1.QinggerLibURL.URLUtil);
            chai_1.expect(urlUtil(testUrl)).to.be.an.instanceof(urlUtil_1.QinggerLibURL.URLUtil);
            chai_1.expect(urlUtil(testUrlWithQuery)).to.be.an.instanceof(urlUtil_1.QinggerLibURL.URLUtil);
        });
        it("构造后，getUrl获取实际的URL", function () {
            chai_1.expect(urlUtil().getUrl()).eq("");
            chai_1.expect(urlUtil(testUrl).getUrl()).eq(testUrl);
        });
    });
    mocha_typescript_1.suite("2.getUrlHost获取URL-Host名测试:", function () {
        it("直接获取URL上的Host名称", function () {
            chai_1.expect(urlUtil().getUrlHost()).eq(""); // 空地址
            chai_1.expect(urlUtil(testUrl).getUrlHost()).eq("blog.csdn.net");
            chai_1.expect(urlUtil(testUrlWithQuery).getUrlHost()).eq("cn.bing.com");
            chai_1.expect(urlUtil(testUrlWithFlags).getUrlHost()).eq("localhost:7188");
        });
        it("获取带有http/https的Host名称", function () {
            chai_1.expect(urlUtil().getUrlHost(true)).eq('');
            chai_1.expect(urlUtil(testUrl).getUrlHost(true)).eq('http://blog.csdn.net');
            chai_1.expect(urlUtil(testUrlWithFlags).getUrlHost(true)).eq("http://localhost:7188");
        });
    });
    mocha_typescript_1.suite("3.setUrlQueryParams设置URL-Query测试:", function () {
        var queries = {
            p: 1,
            q: 'test',
        };
        it("在URL上设置参数?p=1&q=test", function () {
            chai_1.expect(urlUtil().setUrlQueryParams(queries)).eq("?p=1&q=test");
            chai_1.expect(urlUtil(testUrlWithQuery).setUrlQueryParams(queries))
                .eq('https://cn.bing.com/search?q=test&qs=n&form=QBRE&p=1');
            chai_1.expect(urlUtil(testUrlWithFlags).setUrlQueryParams(queries))
                .eq('http://localhost:7188/periodical?q=test&corpId=B2CCIRCLE&p=1#/path1/path2');
        });
    });
    mocha_typescript_1.suite("4.URL Query 查询测试：", function () {
        it("获得URL上所有的query值", function () {
            chai_1.expect(urlUtil("https://unixtime.51240.com/").getUrlQueryAllParams()).deep.eq({});
            chai_1.expect(urlUtil("https://unixtime.51240.com/?p=1&q=3").getUrlQueryAllParams()).deep.eq({
                p: "1",
                q: "3"
            });
            chai_1.expect(urlUtil("https://unixtime.51240.com/?p=1#/a=1&b=2").getUrlQueryAllParams()).deep.eq({
                p: "1"
            });
        });
        it("查找URL的queryItem", function () {
            chai_1.expect(urlUtil("https://unixtime.51240.com/").hasUrlQueryItem('p')).eq(false);
            chai_1.expect(urlUtil("https://unixtime.51240.com/?p=1&q=3").hasUrlQueryItem('p')).eq(true);
            chai_1.expect(urlUtil("https://unixtime.51240.com/?qstring=1#/a=1&b=2")
                .getUrlQueryItem('qstring')).eq("1");
        });
    });
});
