/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 添加基金分数信息
const fn_add_fund_score_list = async (new_list=[]) => {
    await db.connect(config.db_path);

    let res = {
        "err" : false,
        "res" : "success",
    }

    for (let elem of new_list) {
        // 获取最新净值日期
        let net_info = await db.get(`SELECT * FROM t_fund_net_worth_list WHERE code = "${elem.code}" ORDER BY date DESC limit 1;`);

        if (net_info.err) {
            res.err = true;
            res.res = net_info.res;
            break;
        }

        elem.date = net_info.res[0].date;

        // 判断数据是否存在
        let info = await db.get(`SELECT * FROM t_fund_score WHERE code = "${elem.code}" AND date = "${elem.date}";`);

        if (info.err) {
            res.err = true;
            res.res = info.res;
            break;
        }

        let sql = "INSERT INTO t_fund_score (code, name, score, date) VALUES (?,?,?,?)";
        let val = [elem.code, elem.name, elem.score, elem.date];

        if (info.res.length) {
            sql = "UPDATE t_fund_score SET score = ? WHERE code = ? AND date = ?;";
            val = [ elem.score, elem.code, elem.date ];
        }

        let add_res = await db.set(sql, val);
        if (add_res.err) {
            res.err = true;
            res.res = add_res.err;
            break;
        }
    }

    await db.close();

    return res;
};

module.exports = fn_add_fund_score_list;
