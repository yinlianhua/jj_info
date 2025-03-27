/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

async function sync_fund_main(date) {
    // 获取基金主要信息
    let fn_get_focus_main_info = require("./func/fn_get_focus_main_info");

    // 添加基金主要信息
    let fn_add_fund_main_list = require("./func/fn_add_fund_main_list");

    let main_list = await fn_get_focus_main_info(date);

    if (main_list.err) {
        console.log(`获取基金主要信息失败, ${main_list.res}`);
        process.exit(-1);
    }

    let add_res = await fn_add_fund_main_list(main_list.res);

    if (add_res.err) {
        console.log(`更新基金主要信息失败, ${add_res.res}`);
        process.exit(-1);
    }

    /*
    // 添加基金分数记录(WARN: 废弃)
    let fn_add_fund_score_list = require("./func/fn_add_fund_score_list");

    let score_res = await fn_add_fund_score_list(main_list.res);

    if (score_res.err) {
        console.log(`更新基金分数信息失败, ${score_res.res}`);
        process.exit(-1);
    }
    */

    console.log("基金信息更新成功");
}

module.exports = sync_fund_main;
