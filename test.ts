/**
 * Created by Qingger Corp.
 * User: Thinkpad
 * Date: 2019/4/12
 * Time: 11:17
 * Desc:
 */
import {QinggerHttpClient} from "./library/httpClient/httpClient";
import httpClient = QinggerHttpClient.httpClient;
import {BaseHttpRequestOption} from "./library/httpClient/baseHttpClientType";

const fs = require("fs");

const https = require("https");


const TEST_HTTP_REQUEST: BaseHttpRequestOption = {
    name : 'EPS_POST_TOKEN',
    baseURL : 'https://ips.service.qingger.cn',
    path : '/',
    version : 1,
    method : 'GET',
    queryParams : [],
    postParams : ['apiId','timestamp','target','nonce','apiSign','AK'],
    reqLimit : 2,
    optionItems: {
        httpsAgent: {
            // host: 'ips.service.qingger.cn',
            pfx: fs.readFileSync('./test/apiclient_cert.pfx'),
            passphrase:'1520301081',
            path: 'https://ips.service.qingger.cn/',
        }
    }
};

async function testSendRequest() {
   let res = await httpClient.sendRequest(TEST_HTTP_REQUEST,{}).catch((err)=>{
        console.error("----------------------Error:",err);
   });
   console.log("------------------------------res",res);
}

testSendRequest();


