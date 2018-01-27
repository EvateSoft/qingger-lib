"use strict";
/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:28
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HelloWorld;
(function (HelloWorld) {
    function sayHello() {
        console.log("say Hello");
    }
    HelloWorld.sayHello = sayHello;
    function sayGoodbye() {
        console.log('goodbye');
    }
    HelloWorld.sayGoodbye = sayGoodbye;
})(HelloWorld = exports.HelloWorld || (exports.HelloWorld = {}));
