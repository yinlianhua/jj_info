/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 获取基金主要信息列表
const fn_get_fund_main_list = async (date="") => {
    await db.connect(config.db_path);

    let sql = "SELECT * FROM t_fund_main_info;";

    if (date != "") {
        sql = `SELECT * FROM t_fund_main_info WHERE date = "${date}";`;
    }

    // 获取关注基金
    let main_list = await db.get(sql);

    await db.close();

    if (main_list.err) {
        return {
            "err" : true,
            "res" : main_list.res,
        }
    }

    if (main_list.res.length == 0) {
        return {
            "err" : false,
            "res" : [],
        }
    }

    return {
        "err" : false,
        "res" : main_list.res,
    }
};

module.exports = fn_get_fund_main_list;
