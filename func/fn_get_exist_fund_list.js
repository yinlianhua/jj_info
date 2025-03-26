/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 获取存量基金列表
const fn_get_exist_fund_list = async () => {
    await db.connect(config.db_path);

    let fund_list = await db.get("SELECT * FROM t_fund_list;");

    await db.close();

    if (fund_list.err) {
        return {
            "err" : true,
            "res" : fund_list.res,
        }
    }

    return {
        "err" : false,
        "res" : fund_list.res,
    };
};

module.exports = fn_get_exist_fund_list;
