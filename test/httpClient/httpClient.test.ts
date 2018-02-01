/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 16:44
 */

import {suite, test, slow} from "mocha-typescript";
import {expect} from "chai";
import {QinggerHttpClient} from "../../library/httpClient/httpClient";
import httpClient = QinggerHttpClient.httpClient;
import {BaseAuthType} from "../../library/httpClient/baseHttpClientType";
import HttpClient = QinggerHttpClient.HttpClient;

const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

declare const Promise: any;

suite("HttpClient对象测试",function(){

    const mock = new MockAdapter(axios);

    // 使用ajax mock 一定要将所有的mock放在一起,否则如果mock放在各个子suite中，会冲突导致错误
    before(function () {
        mock.onPost("epsApi/userAuth/login/Qingger").reply(200,{
            code : 20000,
            content : 'USER-TOKEN'
        });

        mock.onGet("epsApi/user").reply(200,{
            code : 20000,
            content : { userName : 'shipfi', }
        });

        mock.onGet("epsApi/site").reply(200,{
            code : 20000,
            content : { siteName: 'SI001', }
        });
    });

    const EPS_POST_TOKEN = {
        name : 'EPS_POST_TOKEN',
        baseURL : '',
        path : 'epsApi/userAuth/login/{group}',
        version : 1,
        method : 'POST',
        queryParams : [],
        postParams : ['apiId','timestamp','target','nonce','apiSign','AK'],
        reqLimit : 2
    };

    const EPS_GET_USER_INFO = {
        name : 'EPS_GET_USER_INFO',
        baseURL : '',
        path : 'epsApi/user',
        version : 1,
        method : 'GET',
        queryParams : ['userId'],
    };

    const EPS_GET_SITE_INFO_WITH_TOKEN = {
        name : 'EPS_GET_SITE_INFO_WITH_TOKEN',
        baseURL : '',
        path : 'epsApi/site',
        version : 1,
        method : 'GET',
        auth : true
    };

    suite("1.httpClient对象构造测试:",function () {
        it("httpClient函数调用返回HttpClient类对象",function () {
            expect(httpClient).instanceof(QinggerHttpClient.HttpClient);
        });

        it("httpClient函数请求参数默认值确认",function () {
            let httpClientRequestData = httpClient.getHttpClientRequestData();
            expect(httpClientRequestData.requestName).eq('defaultName');
            expect(httpClientRequestData.requestOptions).deep.eq({
                name:'defaultName',
                method : "GET",
                baseURL : '',
                path : '/',
                auth : false,
                headers : {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            });
            expect(httpClientRequestData.urlPath).eq('/');
            expect(httpClientRequestData.authType).eq(BaseAuthType.NONE);
            expect(httpClientRequestData.headers).deep.eq({
                'Content-Type': 'application/json; charset=UTF-8'
            });
        });
    });



    suite("2.httpClient.setParams测试:",function () {
        let setParams = {
            queryParams : { a:1, b:2 },
            postParams : {d1:[1,2],d2:{p1:1,p2:2}},
            pathParams : {group:'Qingger'}
        };
        it("http Reqeust Params设置",function () {
            httpClient.initRequestConfig(EPS_POST_TOKEN);
            httpClient.setAllParams(setParams);
            let clientRequestData = httpClient.getHttpClientRequestData();
            expect(clientRequestData.queryParams).deep.eq(setParams.queryParams);
            expect(clientRequestData.postParams).deep.eq(setParams.postParams);
            expect(clientRequestData.baseURL).eq('');
            expect(clientRequestData.urlPath).eq('epsApi/userAuth/login/Qingger');
        });

        it("http Request Params清除",function () {
            httpClient.initRequestConfig(EPS_POST_TOKEN);
            httpClient.setAllParams(setParams);
            httpClient.clearAllParams();
            let clientRequestData = httpClient.getHttpClientRequestData();
            expect(clientRequestData.queryParams).deep.eq({});
            expect(clientRequestData.postParams).deep.eq({});
            expect(clientRequestData.baseURL).eq('');
            expect(clientRequestData.urlPath).eq('epsApi/userAuth/login/Qingger');
        });
    });



    suite("3.sendRequest测试:",function () {

        it("POST请求/userAuth/login,数据返回正常:",function (done) {
            slow(500);
            let httpClient1 = new HttpClient();
            httpClient1.sendRequest(EPS_POST_TOKEN,{
                pathParams : {group: 'Qingger'},
                postParams : { apiId : 'ADMIN-TOKEN', target : 'Qingger'},
            }).then(function (content) {
                expect(content).deep.eq({code:20000,content:'USER-TOKEN'});
                done();
            });
        });


        it("GET请求/user,数据返回正常:",function (done) {
            slow(500);
            let httpClient2 = new HttpClient();
            httpClient2.sendRequest(EPS_GET_USER_INFO,{
                // queryParams : {userId : 1001}
            }).then(function (res) {
                expect(res).deep.eq({
                    code: 20000,
                    content: { userName: 'shipfi', }
                  });
                done();
            }).catch(function(err){
                console.log(err);
            });
        })
    });


    suite("4.sendRequestWithToken函数测试",function () {
        let objWithFunToken = {
            getToken : function () {
               return Promise.resolve('TOKEN')
            }
        };

        it("设置token并调用接口",function (done) {
            let httpClient3 = new HttpClient();
            httpClient3.sendRequestWithToken(EPS_GET_SITE_INFO_WITH_TOKEN,{},
                objWithFunToken.getToken,objWithFunToken)
                .then(function (res) {
                    expect(res).deep.eq({
                        code: 20000,
                        content: { siteName: 'SI001'}
                    });

                    done();
                });
        });

    });
});