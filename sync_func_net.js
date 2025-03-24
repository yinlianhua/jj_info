/**
 * Date : 2025-03-22
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

(async () => {
    // 获取待同步基金列表
    let fn_get_focus_fund_list = require("./func/fn_get_focus_fund_list");

    // 获取基金净值信息
    let fn_get_fund_net_values = require("./func/fn_get_fund_net_values");

    // 写入基金净值信息
    let fn_add_fund_net_values = require("./func/fn_add_fund_net_values");

    let focus_fund_list = await fn_get_focus_fund_list();

    if (focus_fund_list.err) {
        console.log(`获取关注基金列表失败, ${focus_fund_list.res}`);
        process.exit(-1);
    }

    // let start_date = moment().subtract(1, "day").format("YYYY-MM-DD");
    // let end_date   = moment().format("YYYY-MM-DD");
    let start_date = "2021-01-01";
    let end_date   = "2025-03-23";

    for (let elem of focus_fund_list.res) {
        console.log(JSON.stringify(elem));

        let net_data = await fn_get_fund_net_values(elem.code, elem.name, start_date, end_date);

        if (net_data.err) {
            console.log(`获取基金净值失败, ${net_data.res}`);
            process.exit(-1);
        }

        let add_res = await fn_add_fund_net_values(net_data.res);

        if (add_res.err) {
            console.log(`添加基金净值失败, ${add_res.res}`);
            process.exit(-1);
        }
    }

	process.exit(0)
})()
