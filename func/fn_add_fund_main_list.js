/**
 * Date : 2025-03-22
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 添加基金主要信息
const fn_add_fund_main_list = async (new_list=[]) => {
    await db.connect(config.db_path);

    let res = {
        "err" : false,
        "res" : "success",
    }

    for (let elem of new_list) {
        // 判断是否存在
        let info = await db.get(`SELECT * FROM t_fund_main_info WHERE code = "${elem.code}";`);

        if (info.err) {
            res.err = true;
            res.res = info.res;
            break;
        }

        let sql = "INSERT INTO t_fund_main_info(code,name,latest,score,avg005,avg010,avg015,avg020,avg025,avg030,avg060,avg090,avg120,avg150,avg180,avg210,avg240,avg270,min005,min010,min015,min020,min025,min030,min060,min090,min120,min150,min180,min210,min240,min270,max005,max010,max015,max020,max025,max030,max060,max090,max120,max150,max180,max210,max240,max270) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        let val = [
            elem.code, elem.name, elem.latest, elem.score,
            elem.avg005, elem.avg010, elem.avg015, elem.avg020, elem.avg025, elem.avg030,
            elem.avg060, elem.avg090, elem.avg120, elem.avg150, elem.avg180, elem.avg210,
            elem.avg240, elem.avg270,
            elem.min005, elem.min010, elem.min015, elem.min020, elem.min025, elem.min030,
            elem.min060, elem.min090, elem.min120, elem.min150, elem.min180, elem.min210,
            elem.min240, elem.min270,
            elem.max005, elem.max010, elem.max015, elem.max020, elem.max025, elem.max030,
            elem.max060, elem.max090, elem.max120, elem.max150, elem.max180, elem.max210,
            elem.max240, elem.max270,
        ]

        if (info.res.length) {
            sql = "UPDATE t_fund_main_info SET latest = ?, score = ?, avg005 = ?, avg010 = ?, avg015 = ?, avg020 = ?, avg025 = ?, avg030 = ?, avg060 = ?, avg090 = ?, avg120 = ?, avg150 = ?, avg180 = ?, avg210 = ?, avg240 = ?, avg270 = ?, min005 = ?, min010 = ?, min015 = ?, min020 = ?, min025 = ?, min030 = ?, min060 = ?, min090 = ?, min120 = ?, min150 = ?, min180 = ?, min210 = ?, min240 = ?, min270 = ?, max005 = ?, max010 = ?, max015 = ?, max020 = ?, max025 = ?, max030 = ?, max060 = ?, max090 = ?, max120 = ?, max150 = ?, max180 = ?, max210 = ?, max240 = ?, max270 = ? WHERE code = ?;";
            val = [
                elem.latest, elem.score,
                elem.avg005, elem.avg010, elem.avg015, elem.avg020, elem.avg025, elem.avg030,
                elem.avg060, elem.avg090, elem.avg120, elem.avg150, elem.avg180, elem.avg210,
                elem.avg240, elem.avg270,
                elem.min005, elem.min010, elem.min015, elem.min020, elem.min025, elem.min030,
                elem.min060, elem.min090, elem.min120, elem.min150, elem.min180, elem.min210,
                elem.min240, elem.min270,
                elem.max005, elem.max010, elem.max015, elem.max020, elem.max025, elem.max030,
                elem.max060, elem.max090, elem.max120, elem.max150, elem.max180, elem.max210,
                elem.max240, elem.max270,
                elem.code
            ]
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

module.exports = fn_add_fund_main_list;
