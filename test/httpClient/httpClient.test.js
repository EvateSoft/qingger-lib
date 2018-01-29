"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/29
 * Time: 16:44
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_typescript_1 = require("mocha-typescript");
var chai_1 = require("chai");
var httpClient_1 = require("../../library/httpClient/httpClient");
var httpClient = httpClient_1.QinggerHttpClient.httpClient;
var baseHttpClientType_1 = require("../../library/httpClient/baseHttpClientType");
var HttpClient = httpClient_1.QinggerHttpClient.HttpClient;
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
mocha_typescript_1.suite("HttpClient对象测试", function () {
    var mock = new MockAdapter(axios);
    // 使用ajax mock 一定要将所有的mock放在一起,否则如果mock放在各个子suite中，会冲突导致错误
    before(function () {
        mock.onPost("epsApi/userAuth/login/Qingger").reply(200, {
            code: 20000,
            content: 'USER-TOKEN'
        });
        mock.onGet("epsApi/user").reply(200, {
            code: 20000,
            content: { userName: 'shipfi', }
        });
        mock.onGet("epsApi/site").reply(200, {
            code: 20000,
            content: { siteName: 'SI001', }
        });
    });
    var EPS_POST_TOKEN = {
        name: 'EPS_POST_TOKEN',
        baseURL: '',
        path: 'epsApi/userAuth/login/{group}',
        version: 1,
        method: 'POST',
        queryParams: [],
        postParams: ['apiId', 'timestamp', 'target', 'nonce', 'apiSign', 'AK'],
        reqLimit: 2
    };
    var EPS_GET_USER_INFO = {
        name: 'EPS_GET_USER_INFO',
        baseURL: '',
        path: 'epsApi/user',
        version: 1,
        method: 'GET',
        queryParams: ['userId'],
    };
    var EPS_GET_SITE_INFO_WITH_TOKEN = {
        name: 'EPS_GET_SITE_INFO_WITH_TOKEN',
        baseURL: '',
        path: 'epsApi/site',
        version: 1,
        method: 'GET',
        auth: true
    };
    mocha_typescript_1.suite("1.httpClient对象构造测试:", function () {
        it("httpClient函数调用返回HttpClient类对象", function () {
            chai_1.expect(httpClient).instanceof(httpClient_1.QinggerHttpClient.HttpClient);
        });
        it("httpClient函数请求参数默认值确认", function () {
            var httpClientRequestData = httpClient.getHttpClientRequestData();
            chai_1.expect(httpClientRequestData.requestName).eq('defaultName');
            chai_1.expect(httpClientRequestData.requestOptions).deep.eq({
                name: 'defaultName',
                method: "GET",
                baseURL: '',
                path: '/',
                auth: false,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            });
            chai_1.expect(httpClientRequestData.urlPath).eq('/');
            chai_1.expect(httpClientRequestData.authType).eq(baseHttpClientType_1.BaseAuthType.NONE);
            chai_1.expect(httpClientRequestData.headers).deep.eq({
                'Content-Type': 'application/json; charset=UTF-8'
            });
        });
    });
    mocha_typescript_1.suite("2.httpClient.setParams测试:", function () {
        var setParams = {
            queryParams: { a: 1, b: 2 },
            postParams: { d1: [1, 2], d2: { p1: 1, p2: 2 } },
            pathParams: { group: 'Qingger' }
        };
        it("http Reqeust Params设置", function () {
            httpClient.initRequestConfig(EPS_POST_TOKEN);
            httpClient.setAllParams(setParams);
            var clientRequestData = httpClient.getHttpClientRequestData();
            chai_1.expect(clientRequestData.queryParams).deep.eq(setParams.queryParams);
            chai_1.expect(clientRequestData.postParams).deep.eq(setParams.postParams);
            chai_1.expect(clientRequestData.baseURL).eq('');
            chai_1.expect(clientRequestData.urlPath).eq('epsApi/userAuth/login/Qingger');
        });
        it("http Request Params清除", function () {
            httpClient.initRequestConfig(EPS_POST_TOKEN);
            httpClient.setAllParams(setParams);
            httpClient.clearAllParams();
            var clientRequestData = httpClient.getHttpClientRequestData();
            chai_1.expect(clientRequestData.queryParams).deep.eq({});
            chai_1.expect(clientRequestData.postParams).deep.eq({});
            chai_1.expect(clientRequestData.baseURL).eq('');
            chai_1.expect(clientRequestData.urlPath).eq('epsApi/userAuth/login/Qingger');
        });
    });
    mocha_typescript_1.suite("3.sendRequest测试:", function () {
        it("POST请求/userAuth/login,数据返回正常:", function (done) {
            mocha_typescript_1.slow(500);
            var httpClient1 = new HttpClient();
            httpClient1.sendRequest(EPS_POST_TOKEN, {
                pathParams: { group: 'Qingger' },
                postParams: { apiId: 'ADMIN-TOKEN', target: 'Qingger' },
            }).then(function (content) {
                chai_1.expect(content).deep.eq({ code: 20000, content: 'USER-TOKEN' });
                done();
            });
        });
        it("GET请求/user,数据返回正常:", function (done) {
            mocha_typescript_1.slow(500);
            var httpClient2 = new HttpClient();
            httpClient2.sendRequest(EPS_GET_USER_INFO, {}).then(function (res) {
                chai_1.expect(res).deep.eq({
                    code: 20000,
                    content: { userName: 'shipfi', }
                });
                done();
            }).catch(function (err) {
                console.log(err);
            });
            console.log(httpClient.getHttpClientRequestData());
        });
    });
    mocha_typescript_1.suite("4.sendRequestWithToken函数测试", function () {
        var objWithFunToken = {
            getToken: function () {
                return Promise.resolve('TOKEN');
            }
        };
        it("设置token并调用接口", function (done) {
            var httpClient3 = new HttpClient();
            httpClient3.sendRequestWithToken(EPS_GET_SITE_INFO_WITH_TOKEN, {}, objWithFunToken.getToken, objWithFunToken)
                .then(function (res) {
                chai_1.expect(res).deep.eq({
                    code: 20000,
                    content: { siteName: 'SI001' }
                });
                done();
            });
        });
    });
});
