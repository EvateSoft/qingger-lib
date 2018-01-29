/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/28
 * Time: 1:37
 */

import { suite, test, slow} from "mocha-typescript";
import {expect} from "chai";
import {QinggerLibUtils} from "../../src/utils/functions";

suite("工具类函数测试(Util Functions Test)",function() {

    suite("1.empty函数测试:",function(){
        let emptyVars = [[],undefined,null,{},0,''];
        emptyVars.forEach(function(emptyVar){
            it("empty should be true for EmptyVars:",function(){
                let ret = QinggerLibUtils.empty(emptyVar);
                expect(ret).to.eq(true);
            })
        });

        let notEmptyVars = [{a:1},[0],"s",1,Object,'3311'];
        notEmptyVars.forEach(function(nonEmptyVar){
            it("nonEmpty should be false for nonEmptyVars:",function () {
                let ret = QinggerLibUtils.empty(nonEmptyVar);
                expect(ret).to.eq(false);
            })
        });
    });

    suite("2.isset函数测试:",function () {
        let testObj = {
            num : 0,
            list : [1,2,3],
            data : {
                a : 10,
                b : 11,
                c : 'TESTC'
            }
        };

        it("对象和对象属性存在返回true",function(){
            let trueResults = [];

            trueResults.push(QinggerLibUtils.isset(true));
            trueResults.push(QinggerLibUtils.isset(false));
            trueResults.push(QinggerLibUtils.isset(0));
            trueResults.push(QinggerLibUtils.isset(1));
            trueResults.push(QinggerLibUtils.isset([]));
            trueResults.push(QinggerLibUtils.isset(testObj.num));
            trueResults.push(QinggerLibUtils.isset(testObj.data));
            trueResults.push(QinggerLibUtils.isset(testObj.data.b));
            trueResults.push(QinggerLibUtils.isset(testObj,"list"));
            trueResults.push(QinggerLibUtils.isset(testObj,"data.b"));
            trueResults.push(QinggerLibUtils.isset(testObj.data,"c"));
            trueResults.forEach(function(testRet){
                expect(testRet).to.eq(true);
            });

        });

        it("对象和对象属性不存在返回false",function () {
            let falseResults = [];
            let emptyObject = {}; // emptyObject也作notSet处理
            falseResults.push(QinggerLibUtils.isset(null));
            falseResults.push(QinggerLibUtils.isset(undefined));
            falseResults.push(QinggerLibUtils.isset(emptyObject));
            falseResults.push(QinggerLibUtils.isset(testObj["nonObject"]));
            falseResults.push(QinggerLibUtils.isset(testObj,"nonObject2"));
            falseResults.push(QinggerLibUtils.isset(testObj,"data.non"));
            falseResults.forEach(function(testRet){
                expect(testRet).to.eq(false);
            });
        })
    });

    suite("3.generateIndexArray函数测试:",function(){
        it("generateIndexArray(100)返回[0-99]的数组",function(){
            let giArr = QinggerLibUtils.generateIndexArray(100);
            expect(giArr).to.be.instanceof(Array);
            expect(giArr).to.have.lengthOf(100);
            expect(giArr[0]).to.equal(0);
            expect(giArr[99]).to.equal(99);
        });
    });

    suite("4.inArray函数测试:",function () {
        let testArray = [1,'a',{attr:1},1,true,[2,3]];

        it("在Array中存在基本类型数据的能返回true",function () {
            let inPos0 = QinggerLibUtils.inArray(1, testArray);
            let inPos1 = QinggerLibUtils.inArray('a', testArray);
            // let inPos2 = QinggerLibUtils.inArray({attr:1},testArray);
            let inPos3 = QinggerLibUtils.inArray(1, testArray);
            let inPos4 = QinggerLibUtils.inArray(true, testArray);
            let inPos1Start2 = QinggerLibUtils.inArray(1, testArray, 2);
            let findPoses = [inPos0, inPos1, inPos3, inPos4,inPos1Start2];
            expect(findPoses).to.deep.equal([true, true, true, true, true]);
        });

        it("在Array中不存在的数据返回false",function(){
            let notPos1 = QinggerLibUtils.inArray(5,testArray);
            // 从第三个索引查找
            let notPos2 = QinggerLibUtils.inArray('a',testArray,3);
            expect([notPos1,notPos2]).to.deep.equal([false, false]);
        });

        it("在Array中查找Object/Array数据返回false",function(){
            let inPosObj = QinggerLibUtils.inArray({attr:1},testArray);
            let inPosArray = QinggerLibUtils.inArray([2,3],testArray);
            expect([inPosObj,inPosArray]).to.deep.equal([false, false]);
        });
    });

    suite("5.getRandomInt函数测试:",function () {
        it("getRandomInt返回随机数在1-100之间",function(){
              let ri = QinggerLibUtils.getRandomInt(1,100);
              expect(ri).to.be.a("number");
              expect(ri).to.be.at.least(1).be.at.most(100);
              // expect(ri).to.be.at.most(100);
        });
    });

    suite("6.sleep/timeout函数测试:",function () {

        it("timeout函数返回Promise",function(){
          let t = QinggerLibUtils.timeout(1200);
          expect(t).to.be.a('promise');
        });


        it("timeout(1200)函数1200ms后通过resolve返回",function(done){
            slow(2000);
            QinggerLibUtils.timeout(1200).then(function(){
                done();
                return true;
            });
        });

        it("sleep(1200)暂停1200ms后resolve返回",function(done:Function){
            slow(2000);
            QinggerLibUtils.sleep(1200,done);
        });
    });
});