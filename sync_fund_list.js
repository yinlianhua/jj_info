/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

(async () => {
    // 获取最新基金列表
    let fn_get_latest_fund_list = require("./func/fn_get_latest_fund_list");
    // 获取存量基金列表
    let fn_get_exist_fund_list = require("./func/fn_get_exist_fund_list");
    // 插入新的基金列表
    let fn_add_new_fund_list = require("./func/fn_add_new_fund_list");

    let [
        latest_fund_list,
        exist_fund_list,
    ] = await Promise.all([
        fn_get_latest_fund_list(),
        fn_get_exist_fund_list(),
    ]);

    if (latest_fund_list.err) {
        console.log(`获取最新基金列表失败, ${latest_fund_list.res}`);
        process.exit(-1);
    }

    if (exist_fund_list.err) {
        console.log(`获取存量基金列表失败, ${exist_fund_list.res}`);
        process.exit(-1);
    }

    let exist_fund_map = _.indexBy(exist_fund_list.res, "code");

    let new_list = [];

    for (let elem of latest_fund_list.res) {
        if (exist_fund_map[elem.code] == undefined) {
            new_list.push(elem);
        }
    }

    if (new_list.length > 0) {
        let add_res = await fn_add_new_fund_list(new_list);

        if (add_res.err) {
            console.log(`添加新的基金列表失败, ${add_res.res}`);
            process.exit(-1);
        }
    }

    console.log("基金列表更新成功");

	process.exit(0)
})()
