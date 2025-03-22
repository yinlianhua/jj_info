/**
 * Date : 2025-03-22
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 添加基金净值
const fn_add_fund_net_values = async (new_list=[]) => {
    await db.connect(config.db_path);

    let res = {
        "err" : false,
        "res" : "success",
    }

    for (let elem of new_list) {
        let sql = "INSERT INTO t_fund_net_worth_list(code, name, jjjz, ljjz, date) VALUES(?,?,?,?,?)";
        let val = [ elem.code, elem.name, elem.jjjz, elem.ljjz, elem.date ];
        let add_res = await db.set(sql, val);
        if (add_res.err) {
            res.err = true;
            res.res = add_res.err;
        }
    }

    await db.close();

    return res;
};

module.exports = fn_add_fund_net_values;
