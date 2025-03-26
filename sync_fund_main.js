/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

(async () => {
    // 获取基金主要信息
    let fn_get_focus_main_info = require("./func/fn_get_focus_main_info");

    // 添加基金主要信息
    let fn_add_fund_main_list = require("./func/fn_add_fund_main_list");

    let main_list = await fn_get_focus_main_info();

    if (main_list.err) {
        console.log(`获取基金主要信息失败, ${main_list.res}`);
        process.exit(-1);
    }

    let add_res = await fn_add_fund_main_list(main_list.res);

    if (add_res.err) {
        console.log(`更新基金主要信息失败, ${add_res.res}`);
        process.exit(-1);
    }

    console.log("基金信息更新成功");

	process.exit(0)
})()
