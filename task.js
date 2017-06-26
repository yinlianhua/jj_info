/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let argv   = require('yargs').argv;
let _      = require('underscore');
let moment = require('moment');

(async () => {
    if (argv.t == undefined) {
        console.log("Messing Task Params !");

        process.exit(-1);
    }

    // 初始化
    require('./init')();

    console.log("Task start, Time %s, Task %s", moment().format("YYYY-MM-DD HH:mm:ss"), argv.t);

    const task_loader = require(BASIC_PATH + '/core/task_loader');

    task_loader(argv.t, { "task" : argv.t });

    setInterval(() => {
        if (global.TASK_COUNT == 0) {
            console.log("Task end, Time %s, Task %s", moment().format("YYYY-MM-DD HH:mm:ss"), argv.t);

            process.exit(0);
        }
    }, 3000)
})();
