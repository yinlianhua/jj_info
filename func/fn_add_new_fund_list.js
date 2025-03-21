/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 添加新基金列表
const fn_add_new_fund_list = async (new_list=[]) => {
    await db.connect(config.db_path);

    let res = {
        "err" : false,
        "res" : "success",
    }

    for (let elem of new_list) {
        let sql = "INSERT INTO t_fund_list(code, name, main_type, sub_type, focus, state) VALUES(?,?,?,?,?,?)";
        let val = [ elem.code, elem.name, elem.main_type, elem.sub_type, elem.focus, elem.state ];
        let add_res = await db.set(sql, val);
        if (add_res.err) {
            res.err = true;
            res.res = add_res.err;
        }
    }

    await db.close();

    return res;
};

module.exports = fn_add_new_fund_list;
