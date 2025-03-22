/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../config.json");
let db     = require('../core/sqlite3');

function get_date_map (date="") {
    if (date == "") {
        date = moment().format("YYYY-MM-DD");
    }

    let date_010 = moment(date).subtract(7*2,  "days").format("YYYY-MM-DD"); //  10个工作日
    let date_020 = moment(date).subtract(7*4,  "days").format("YYYY-MM-DD"); //  20个工作日
    let date_030 = moment(date).subtract(7*6,  "days").format("YYYY-MM-DD"); //  30个工作日
    let date_060 = moment(date).subtract(7*12, "days").format("YYYY-MM-DD"); //  60个工作日
    let date_090 = moment(date).subtract(7*18, "days").format("YYYY-MM-DD"); //  90个工作日
    let date_120 = moment(date).subtract(7*24, "days").format("YYYY-MM-DD"); // 120个工作日
    let date_150 = moment(date).subtract(7*30, "days").format("YYYY-MM-DD"); // 150个工作日
    let date_180 = moment(date).subtract(7*36, "days").format("YYYY-MM-DD"); // 180个工作日
    let date_210 = moment(date).subtract(7*42, "days").format("YYYY-MM-DD"); // 210个工作日
    let date_240 = moment(date).subtract(7*48, "days").format("YYYY-MM-DD"); // 240个工作日
    let date_270 = moment(date).subtract(7*54, "days").format("YYYY-MM-DD"); // 270个工作日

    return {
        date,
        date_010,
        date_020,
        date_030,
        date_060,
        date_090,
        date_120,
        date_150,
        date_180,
        date_210,
        date_240,
        date_270,
    }
}

function sql_statement(type, date, table, codes=[]) {
    if (type == "avg") {
        return `
            SELECT code, name, avg(jjjz) AS jjjz, avg(ljjz) AS ljjz
            FROM ${table}
            WHERE date >= "${date}" AND code IN ('${codes.join("','")}')
            GROUP BY code;
        `;
    }

    if (type == "min") {
        return `
            SELECT code, name, min(jjjz) AS jjjz, min(ljjz) AS ljjz
            FROM ${table}
            WHERE date >= "${date}" AND code IN ('${codes.join("','")}')
            GROUP BY code;
        `;
    }

    if (type == "max") {
        return `
            SELECT code, name, max(jjjz) AS jjjz, max(ljjz) AS ljjz
            FROM ${table}
            WHERE date >= "${date}" AND code IN ('${codes.join("','")}')
            GROUP BY code;
        `;
    }

    return "";
}

function get_sql_statement(type, date_map, table, codes=[]) {
    return {
        [`sql_010_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_010, table, codes),
        [`sql_020_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_020, table, codes),
        [`sql_030_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_030, table, codes),
        [`sql_060_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_060, table, codes),
        [`sql_090_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_090, table, codes),
        [`sql_120_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_120, table, codes),
        [`sql_150_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_150, table, codes),
        [`sql_180_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_180, table, codes),
        [`sql_210_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_210, table, codes),
        [`sql_240_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_240, table, codes),
        [`sql_270_${type}_fund_jjjz_list`] : sql_statement(type, date_map.date_270, table, codes),
    }
}

// 获取 SQL 列表
const fn_get_sql_map = async (date="", codes=[]) => {
    let table_map = {
        "t_fund_list"           : "t_fund_list",           // 基金列表
        "t_fund_net_worth_list" : "t_fund_net_worth_list", // 基金净值
    }

    let date_map = get_date_map(date);

    // 全量基金列表
    let sql_all_fund_list = `SELECT * FROM ${table_map.t_fund_list};`;

    // 关注基金列表
    let sql_focus_fund_list = `SELECT * FROM ${table_map.t_fund_list} WHERE state = 1 AND focus = 1;`;

    // 最新基金净值
    let sql_latest_fund_jjjz_list = `
        SELECT MAX(date) AS date, code, name, jjjz, ljjz
        FROM ${table_map.t_fund_net_worth_list}
        WHERE code IN ('${codes.join("','")}')
        GROUP BY code;
    `;

    // AVG 基金净值
    let sql_avg_map = get_sql_statement("avg", date_map, table_map.t_fund_net_worth_list, codes);

    // MIN 基金净值
    let sql_min_map = get_sql_statement("min", date_map, table_map.t_fund_net_worth_list, codes);

    // MAX 基金净值
    let sql_max_map = get_sql_statement("max", date_map, table_map.t_fund_net_worth_list, codes);

    return {
        sql_all_fund_list,
        sql_focus_fund_list,
        sql_latest_fund_jjjz_list,
        ...sql_avg_map,
        ...sql_min_map,
        ...sql_max_map,
    };
};

module.exports = fn_get_sql_map;
