/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

(async () => {
    let code = "515880";

    let date = moment().format('YYYY-MM-DD');

    // 获取基金主要信息
    // let fn_log_fund_main = require("./func/fn_log_fund_main");

    // let logs = await fn_log_fund_main(date);

    let fn_log_fund_main_v2 = require("./func/fn_log_fund_main_v2");

    let logs = await fn_log_fund_main_v2(code);

    for (let log of logs.res) {
        console.log(log)

        if (log == "") {
            await sleep(1000);
        }
    }

	process.exit(0)
})()
