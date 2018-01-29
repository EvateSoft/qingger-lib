"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/28
 * Time: 1:37
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const functions_1 = require("../../src/utils/functions");
mocha_typescript_1.suite("工具类函数测试(Util Functions Test)", function () {
    mocha_typescript_1.suite("1.empty函数测试:", function () {
        let emptyVars = [[], undefined, null, {}, 0, ''];
        emptyVars.forEach(function (emptyVar) {
            it("empty should be true for EmptyVars:", function () {
                let ret = functions_1.QinggerLibUtils.empty(emptyVar);
                chai_1.expect(ret).to.eq(true);
            });
        });
        let notEmptyVars = [{ a: 1 }, [0], "s", 1, Object, '3311'];
        notEmptyVars.forEach(function (nonEmptyVar) {
            it("nonEmpty should be false for nonEmptyVars:", function () {
                let ret = functions_1.QinggerLibUtils.empty(nonEmptyVar);
                chai_1.expect(ret).to.eq(false);
            });
        });
    });
    mocha_typescript_1.suite("2.isset函数测试:", function () {
        let testObj = {
            num: 0,
            list: [1, 2, 3],
            data: {
                a: 10,
                b: 11,
                c: 'TESTC'
            }
        };
        it("对象和对象属性存在返回true", function () {
            let trueResults = [];
            trueResults.push(functions_1.QinggerLibUtils.isset(true));
            trueResults.push(functions_1.QinggerLibUtils.isset(false));
            trueResults.push(functions_1.QinggerLibUtils.isset(0));
            trueResults.push(functions_1.QinggerLibUtils.isset(1));
            trueResults.push(functions_1.QinggerLibUtils.isset([]));
            trueResults.push(functions_1.QinggerLibUtils.isset(testObj.num));
            trueResults.push(functions_1.QinggerLibUtils.isset(testObj.data));
            trueResults.push(functions_1.QinggerLibUtils.isset(testObj.data.b));
            trueResults.push(functions_1.QinggerLibUtils.isset(testObj, "list"));
            trueResults.push(functions_1.QinggerLibUtils.isset(testObj, "data.b"));
            trueResults.push(functions_1.QinggerLibUtils.isset(testObj.data, "c"));
            trueResults.forEach(function (testRet) {
                chai_1.expect(testRet).to.eq(true);
            });
        });
        it("对象和对象属性不存在返回false", function () {
            let falseResults = [];
            let emptyObject = {}; // emptyObject也作notSet处理
            falseResults.push(functions_1.QinggerLibUtils.isset(null));
            falseResults.push(functions_1.QinggerLibUtils.isset(undefined));
            falseResults.push(functions_1.QinggerLibUtils.isset(emptyObject));
            falseResults.push(functions_1.QinggerLibUtils.isset(testObj["nonObject"]));
            falseResults.push(functions_1.QinggerLibUtils.isset(testObj, "nonObject2"));
            falseResults.push(functions_1.QinggerLibUtils.isset(testObj, "data.non"));
            falseResults.forEach(function (testRet) {
                chai_1.expect(testRet).to.eq(false);
            });
        });
    });
    mocha_typescript_1.suite("3.generateIndexArray函数测试:", function () {
        it("generateIndexArray(100)返回[0-99]的数组", function () {
            let giArr = functions_1.QinggerLibUtils.generateIndexArray(100);
            chai_1.expect(giArr).to.be.instanceof(Array);
            chai_1.expect(giArr).to.have.lengthOf(100);
            chai_1.expect(giArr[0]).to.equal(0);
            chai_1.expect(giArr[99]).to.equal(99);
        });
    });
    mocha_typescript_1.suite("4.inArray函数测试:", function () {
        let testArray = [1, 'a', { attr: 1 }, 1, true, [2, 3]];
        it("在Array中存在基本类型数据的能返回true", function () {
            let inPos0 = functions_1.QinggerLibUtils.inArray(1, testArray);
            let inPos1 = functions_1.QinggerLibUtils.inArray('a', testArray);
            // let inPos2 = QinggerLibUtils.inArray({attr:1},testArray);
            let inPos3 = functions_1.QinggerLibUtils.inArray(1, testArray);
            let inPos4 = functions_1.QinggerLibUtils.inArray(true, testArray);
            let inPos1Start2 = functions_1.QinggerLibUtils.inArray(1, testArray, 2);
            let findPoses = [inPos0, inPos1, inPos3, inPos4, inPos1Start2];
            chai_1.expect(findPoses).to.deep.equal([true, true, true, true, true]);
        });
        it("在Array中不存在的数据返回false", function () {
            let notPos1 = functions_1.QinggerLibUtils.inArray(5, testArray);
            // 从第三个索引查找
            let notPos2 = functions_1.QinggerLibUtils.inArray('a', testArray, 3);
            chai_1.expect([notPos1, notPos2]).to.deep.equal([false, false]);
        });
        it("在Array中查找Object/Array数据返回false", function () {
            let inPosObj = functions_1.QinggerLibUtils.inArray({ attr: 1 }, testArray);
            let inPosArray = functions_1.QinggerLibUtils.inArray([2, 3], testArray);
            chai_1.expect([inPosObj, inPosArray]).to.deep.equal([false, false]);
        });
    });
    mocha_typescript_1.suite("5.getRandomInt函数测试:", function () {
        it("getRandomInt返回随机数在1-100之间", function () {
            let ri = functions_1.QinggerLibUtils.getRandomInt(1, 100);
            chai_1.expect(ri).to.be.a("number");
            chai_1.expect(ri).to.be.at.least(1).be.at.most(100);
            // expect(ri).to.be.at.most(100);
        });
    });
    mocha_typescript_1.suite("6.sleep/timeout函数测试:", function () {
        it("timeout函数返回Promise", function () {
            let t = functions_1.QinggerLibUtils.timeout(1200);
            chai_1.expect(t).to.be.a('promise');
        });
        it("timeout(1200)函数1200ms后通过resolve返回", function (done) {
            mocha_typescript_1.slow(2000);
            functions_1.QinggerLibUtils.timeout(1200).then(function () {
                done();
                return true;
            });
        });
        it("sleep(1200)暂停1200ms后resolve返回", function (done) {
            mocha_typescript_1.slow(2000);
            functions_1.QinggerLibUtils.sleep(1200, done);
        });
    });
});
