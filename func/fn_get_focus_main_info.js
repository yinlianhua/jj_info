/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 获取关注基金主要信息
const fn_get_focus_main_info = async (date) => {
    await db.connect(config.db_path);

    // 获取关注基金
    let fund_list = await db.get("SELECT * FROM t_fund_list WHERE state = 1 AND focus = 1;");

    if (fund_list.err) {
        await db.close();

        return {
            "err" : true,
            "res" : fund_list.res,
        }
    }

    let codes = _.pluck(fund_list.res, "code");

    if (codes.length == 0) {
        return {
            "err" : false,
            "res" : [],
        }
    }

    // 获取 SQL map
    let fn_get_sql_map = require("./fn_get_sql_map");

    let sql_map = await fn_get_sql_map(date, codes);

    console.log(sql_map)

    // 获取主要信息
    // 1.当前最新值
    // 2.30/60/90/120/150/180日均值,
    // 3.30/60/90/120/150/180日最大/最小值,
    // 4.回撤比

    return {
        "err" : false,
        "res" : [],
    };
};

module.exports = fn_get_focus_main_info;
