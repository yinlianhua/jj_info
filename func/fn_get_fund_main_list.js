/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let chalk  = require("chalk");
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 获取基金主要信息列表
const fn_get_fund_main_list = async () => {
    await db.connect(config.db_path);

    // 获取关注基金
    let main_list = await db.get("SELECT * FROM t_fund_main_info;");

    if (main_list.err) {
        await db.close();

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
