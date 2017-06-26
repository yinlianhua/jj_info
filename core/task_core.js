/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let fs = require("fs");
let _  = require("underscore");

class TaskBase {
    constructor (input) {
        this.input = input;
    }
}

const extend = (protoProps) => {
    try {
        // 继承父类
        class TaskSuper extends TaskBase {
            constructor(input) {
                super(input);
            }
        }
        
        // 通用方法挂载
        let fn_path = `${BASIC_PATH}/func`;
        let fn_list = fs.readdirSync(fn_path);

        _.each(fn_list, (fn) => {
            fn = fn.split('.')[0];

            Object.assign(TaskSuper.prototype, {
                [fn] : require(`${fn_path}/${fn}`)
            });
        });

        //主函数挂载
        Object.assign(TaskSuper.prototype, protoProps);

        return TaskSuper;

    } catch (e) {
        console.log(e);
        console.log(e.stack);

        process.exit(-1);
    }
};

module.exports = extend;
