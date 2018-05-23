/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 14:11
 */

import { suite, test, slow} from "mocha-typescript";
import {expect} from "chai";
import {QinggerLibURL} from "../../library/utils/urlUtil";
import urlUtil = QinggerLibURL.urlUtil;

suite("URL工具类(urlUtil)测试",function () {

    let testUrl = 'http://blog.csdn.net/vbangle/article/details/5643091';
    let testUrlWithQuery = 'https://cn.bing.com/search?q=typescript+outDir&qs=n&form=QBRE';
    let testUrlWithFlags = 'http://localhost:7188/periodical?q=te&corpId=B2CCIRCLE#/path1/path2';


    suite("1.urlUtil函数构造测试:",function () {
          it("urlUtil生成的对象实例为UrlUtil类型",function () {
              expect(urlUtil()).to.be.an.instanceof(QinggerLibURL.URLUtil);
              expect(urlUtil(testUrl)).to.be.an.instanceof(QinggerLibURL.URLUtil);
              expect(urlUtil(testUrlWithQuery)).to.be.an.instanceof(QinggerLibURL.URLUtil);
          });

          it("构造后，getUrl获取实际的URL",function(){
              expect(urlUtil().getUrl()).eq("");
              expect(urlUtil(testUrl).getUrl()).eq(testUrl);
          });
    });

    suite("2.getUrlHost获取URL-Host名测试:",function () {
        it("直接获取URL上的Host名称",function () {
            expect(urlUtil().getUrlHost()).eq("");  // 空地址
            expect(urlUtil(testUrl).getUrlHost()).eq("blog.csdn.net");
            expect(urlUtil(testUrlWithQuery).getUrlHost()).eq("cn.bing.com");
            expect(urlUtil(testUrlWithFlags).getUrlHost()).eq("localhost:7188");
        });

        it("获取带有http/https的Host名称",function () {
            expect(urlUtil().getUrlHost(true)).eq('');
            expect(urlUtil(testUrl).getUrlHost(true)).eq('http://blog.csdn.net');
            expect(urlUtil(testUrlWithFlags).getUrlHost(true)).eq("http://localhost:7188");
        });
    });


    suite("3.setUrlQueryParams设置URL-Query测试:",function () {
        let queries = {
            p:1,
            q:'test',
        };
        it("在URL上设置参数?p=1&q=test",function(){
            expect(urlUtil().setUrlQueryParams(queries)).eq("?p=1&q=test");
            expect(urlUtil(testUrlWithQuery).setUrlQueryParams(queries))
                .eq('https://cn.bing.com/search?q=test&qs=n&form=QBRE&p=1');
            expect(urlUtil(testUrlWithFlags).setUrlQueryParams(queries))
                .eq('http://localhost:7188/periodical?q=test&corpId=B2CCIRCLE&p=1#/path1/path2');

        });
        it('在URL设置NULL值则会删掉Item',function(){
            expect(urlUtil().setUrlQueryParams({p:null,q:null})).eq('');
            expect(urlUtil(testUrlWithQuery).setUrlQueryParams({p:null,q:'',from:null})).eq('https://cn.bing.com/search?q=&qs=n&form=QBRE');
        });
    });


    suite("4.URL Query 查询测试：",function () {
        it("获得URL上所有的query值",function () {
            expect(urlUtil("https://unixtime.51240.com/").getUrlQueryAllParams()).deep.eq({});
            expect(urlUtil("https://unixtime.51240.com/?p=1&q=3").getUrlQueryAllParams()).deep.eq({
                p:"1",
                q:"3"
            });
            expect(urlUtil("https://unixtime.51240.com/?p=1#/a=1&b=2").getUrlQueryAllParams()).deep.eq({
                p:"1"
            });
        });

        it("查找URL的queryItem",function () {
            expect(urlUtil("https://unixtime.51240.com/").hasUrlQueryItem('p')).eq(false);
            expect(urlUtil("https://unixtime.51240.com/?p=1&q=3").hasUrlQueryItem('p')).eq(true);
            expect(urlUtil("https://unixtime.51240.com/?qstring=1#/a=1&b=2")
                .getUrlQueryItem('qstring')).eq("1");
        });
    });


    suite("5.URL Path 字段测试",function(){
        it("PATH路径Item测试",function(){
            expect(urlUtil("https://unixtime.51240.com/?p=1&q=3").getUrlPathItem(0)).eq("");
            expect(urlUtil("https://unixtime.51240.com/p1?p=1&q=3").getUrlPathItem(0)).eq("");
            expect(urlUtil("https://unixtime.51240.com/p1?p=1&q=3").getUrlPathItem(1)).eq("p1");
            expect(urlUtil("https://unixtime.51240.com/p11/p21").getUrlPathItem(2)).eq("p21");
            expect(urlUtil("https://unixtime.51240.com/p111/p211").getUrlPathItem(-1)).eq("p211");
            expect(urlUtil("https://unixtime.51240.com/p1111/p2111/").getUrlPathItem(-1)).eq("");
            expect(urlUtil("https://unixtime.51240.com/p11111/p21111/").getUrlPathItem(-2)).eq("p21111");
        });
    });

});