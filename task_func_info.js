/**
 * Date : 2025-03-22
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

(async () => {
    // 获取基金主要信息
    let fn_log_fund_main = require("./func/fn_log_fund_main");

    let logs = await fn_log_fund_main();

    for (let log of logs.res) {
        console.log(log)

        if (log == "") {
            await sleep(5000);
        }
    }

	process.exit(0)
})()
