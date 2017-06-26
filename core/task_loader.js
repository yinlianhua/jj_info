/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require("underscore");
let moment = require("moment");

const task_loader = async (name, params={}) => {
    try {
        global.TASK_COUNT++;

        let Task = require(`${global.BASIC_PATH}/task/${name}`);

        let task = new Task(params);

        await task.run();

        global.TASK_COUNT--;
    } catch (e) {
        console.log(e);
        console.log(e.stack);

        process.exit(-1);
    }
};

module.exports = task_loader;
