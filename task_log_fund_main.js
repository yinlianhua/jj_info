/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');
let mail   = require("./core/mail");

(async () => {
    // let date = moment().format('YYYY-MM-DD');

    // 获取基金主要信息
    // let fn_log_fund_main = require("./func/fn_log_fund_main");

    // let logs = await fn_log_fund_main(date);

    let date = "2025-03-31";
    let code = [];

    let fn_log_fund_main_v2 = require("./func/fn_log_fund_main_v2");
    let fn_make_fund_ejs_v1 = require("./func/fn_make_fund_ejs_v1");

    let data = await fn_log_fund_main_v2([], date);

    let html = await fn_make_fund_ejs_v1(data.res);

    let params = {
        "to"      : "yinlianhua@sina.cn",
        "subject" : "最新基金信息",
        "html"    : html
    }

    let send_res = await mail(params);

    console.log(send_res)

	process.exit(0)
})()
