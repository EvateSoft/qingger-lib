/**
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2018/1/27
 * Time: 22:48
 */
export interface ItemObject extends Object {
    [key: string]: any;
}
export interface AnyObject extends ItemObject {
}
/**
 * api错误数据
 */
export interface APIError {
    code: number;
    message: string;
}
/**
 * 构造函数原型
 */
export declare type Constructor = {
    new (...args: any[]): any;
};
export declare type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
};
export declare type FunctionRetPromise<T = any> = (...args: any[]) => Promise<T>;
/**
 * 常用类型的声明
 */
export declare type ItemObjectArray = Array<ItemObject>;
export declare type NumberArray = Array<number>;
export declare type StringArray = Array<string>;
export declare type ItemArray<T = any> = Array<T>;
