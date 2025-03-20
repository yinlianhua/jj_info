/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let fs = require("fs");
let _  = require("underscore");
let path = require("path");

function dir_loop (dir) {
    let files = [];

    // 1.判断是否目录
    let stat = fs.statSync(dir);

    if (stat.isDirectory()) {
        // 2.查询目录
        let list = fs.readdirSync(dir);

        // 3.循环处理
        _.each(list, (file) => {
            files = files.concat(dir_loop(path.join(dir, file)));
        });
    } else {
        // 4.添加文件
        files.push(dir);
    }

    return files;
}


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
        
        /*
        // 通用方法挂载
        let fn_path = `${BASIC_PATH}/func`;
        let fn_list = fs.readdirSync(fn_path);

        _.each(fn_list, (fn) => {
            fn = fn.split('.')[0];

            Object.assign(TaskSuper.prototype, {
                [fn] : require(`${fn_path}/${fn}`)
            });
        });
        */

        // 通用方法挂载
        let fn_list = dir_loop(`${BASIC_PATH}/func`);

        _.each(fn_list, (fn) => {
            let name = fn.split('/');
                name = name[name.length-1].split('.')[0];

            Object.assign(TaskSuper.prototype, {
                [name] : require(fn)
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
