/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 获取关注基金列表
const fn_get_focus_fund_list = async () => {
    await db.connect(config.db_path);

    let fund_list = await db.get("SELECT * FROM t_fund_list WHERE state = 1 AND focus = 1;");

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

module.exports = fn_get_focus_fund_list;
