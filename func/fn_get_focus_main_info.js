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

    if (fund_list.res.length == 0) {
        return {
            "err" : false,
            "res" : [],
        }
    }

    let codes = _.pluck(fund_list.res, "code");

    // 获取 SQL map
    let fn_get_sql_map = require("./fn_get_sql_map");

    let sql_map = await fn_get_sql_map(date, codes);

    // 获取主要信息
    // 1.当前最新值
    // 2.30/60/90/120/150/180日均值,
    // 3.30/60/90/120/150/180日最大/最小值,
    // 4.回撤比

    let [
        data_latest_jjjz,
        data_010_avg_jjjz,
        data_020_avg_jjjz,
        data_030_avg_jjjz,
        data_060_avg_jjjz,
        data_090_avg_jjjz,
        data_120_avg_jjjz,
        data_150_avg_jjjz,
        data_180_avg_jjjz,
        data_210_avg_jjjz,
        data_240_avg_jjjz,
        data_270_avg_jjjz,
        data_010_min_jjjz,
        data_020_min_jjjz,
        data_030_min_jjjz,
        data_060_min_jjjz,
        data_090_min_jjjz,
        data_120_min_jjjz,
        data_150_min_jjjz,
        data_180_min_jjjz,
        data_210_min_jjjz,
        data_240_min_jjjz,
        data_270_min_jjjz,
        data_010_max_jjjz,
        data_020_max_jjjz,
        data_030_max_jjjz,
        data_060_max_jjjz,
        data_090_max_jjjz,
        data_120_max_jjjz,
        data_150_max_jjjz,
        data_180_max_jjjz,
        data_210_max_jjjz,
        data_240_max_jjjz,
        data_270_max_jjjz,
    ] = await Promise.all([
        db.get(sql_map.sql_latest_fund_jjjz_list),
        db.get(sql_map.sql_010_avg_fund_jjjz_list),
        db.get(sql_map.sql_020_avg_fund_jjjz_list),
        db.get(sql_map.sql_030_avg_fund_jjjz_list),
        db.get(sql_map.sql_060_avg_fund_jjjz_list),
        db.get(sql_map.sql_090_avg_fund_jjjz_list),
        db.get(sql_map.sql_120_avg_fund_jjjz_list),
        db.get(sql_map.sql_150_avg_fund_jjjz_list),
        db.get(sql_map.sql_180_avg_fund_jjjz_list),
        db.get(sql_map.sql_210_avg_fund_jjjz_list),
        db.get(sql_map.sql_240_avg_fund_jjjz_list),
        db.get(sql_map.sql_270_avg_fund_jjjz_list),
        db.get(sql_map.sql_010_min_fund_jjjz_list),
        db.get(sql_map.sql_020_min_fund_jjjz_list),
        db.get(sql_map.sql_030_min_fund_jjjz_list),
        db.get(sql_map.sql_060_min_fund_jjjz_list),
        db.get(sql_map.sql_090_min_fund_jjjz_list),
        db.get(sql_map.sql_120_min_fund_jjjz_list),
        db.get(sql_map.sql_150_min_fund_jjjz_list),
        db.get(sql_map.sql_180_min_fund_jjjz_list),
        db.get(sql_map.sql_210_min_fund_jjjz_list),
        db.get(sql_map.sql_240_min_fund_jjjz_list),
        db.get(sql_map.sql_270_min_fund_jjjz_list),
        db.get(sql_map.sql_010_max_fund_jjjz_list),
        db.get(sql_map.sql_020_max_fund_jjjz_list),
        db.get(sql_map.sql_030_max_fund_jjjz_list),
        db.get(sql_map.sql_060_max_fund_jjjz_list),
        db.get(sql_map.sql_090_max_fund_jjjz_list),
        db.get(sql_map.sql_120_max_fund_jjjz_list),
        db.get(sql_map.sql_150_max_fund_jjjz_list),
        db.get(sql_map.sql_180_max_fund_jjjz_list),
        db.get(sql_map.sql_210_max_fund_jjjz_list),
        db.get(sql_map.sql_240_max_fund_jjjz_list),
        db.get(sql_map.sql_270_max_fund_jjjz_list),
    ]);

    data_latest_jjjz  = _.indexBy(data_latest_jjjz.res, "code");

    data_010_avg_jjjz = _.indexBy(data_010_avg_jjjz.res, "code"); 
    data_020_avg_jjjz = _.indexBy(data_020_avg_jjjz.res, "code"); 
    data_030_avg_jjjz = _.indexBy(data_030_avg_jjjz.res, "code"); 
    data_060_avg_jjjz = _.indexBy(data_060_avg_jjjz.res, "code"); 
    data_090_avg_jjjz = _.indexBy(data_090_avg_jjjz.res, "code"); 
    data_120_avg_jjjz = _.indexBy(data_120_avg_jjjz.res, "code"); 
    data_150_avg_jjjz = _.indexBy(data_150_avg_jjjz.res, "code"); 
    data_180_avg_jjjz = _.indexBy(data_180_avg_jjjz.res, "code"); 
    data_210_avg_jjjz = _.indexBy(data_210_avg_jjjz.res, "code"); 
    data_240_avg_jjjz = _.indexBy(data_240_avg_jjjz.res, "code"); 
    data_270_avg_jjjz = _.indexBy(data_270_avg_jjjz.res, "code"); 

    data_010_min_jjjz = _.indexBy(data_010_min_jjjz.res, "code"); 
    data_020_min_jjjz = _.indexBy(data_020_min_jjjz.res, "code"); 
    data_030_min_jjjz = _.indexBy(data_030_min_jjjz.res, "code"); 
    data_060_min_jjjz = _.indexBy(data_060_min_jjjz.res, "code"); 
    data_090_min_jjjz = _.indexBy(data_090_min_jjjz.res, "code"); 
    data_120_min_jjjz = _.indexBy(data_120_min_jjjz.res, "code"); 
    data_150_min_jjjz = _.indexBy(data_150_min_jjjz.res, "code"); 
    data_180_min_jjjz = _.indexBy(data_180_min_jjjz.res, "code"); 
    data_210_min_jjjz = _.indexBy(data_210_min_jjjz.res, "code"); 
    data_240_min_jjjz = _.indexBy(data_240_min_jjjz.res, "code"); 
    data_270_min_jjjz = _.indexBy(data_270_min_jjjz.res, "code"); 

    data_010_max_jjjz = _.indexBy(data_010_max_jjjz.res, "code"); 
    data_020_max_jjjz = _.indexBy(data_020_max_jjjz.res, "code"); 
    data_030_max_jjjz = _.indexBy(data_030_max_jjjz.res, "code"); 
    data_060_max_jjjz = _.indexBy(data_060_max_jjjz.res, "code"); 
    data_090_max_jjjz = _.indexBy(data_090_max_jjjz.res, "code"); 
    data_120_max_jjjz = _.indexBy(data_120_max_jjjz.res, "code"); 
    data_150_max_jjjz = _.indexBy(data_150_max_jjjz.res, "code"); 
    data_180_max_jjjz = _.indexBy(data_180_max_jjjz.res, "code"); 
    data_210_max_jjjz = _.indexBy(data_210_max_jjjz.res, "code"); 
    data_240_max_jjjz = _.indexBy(data_240_max_jjjz.res, "code"); 
    data_270_max_jjjz = _.indexBy(data_270_max_jjjz.res, "code"); 

    let logs_avg = [];
    let logs_min = [];
    let logs_max = [];

    logs_avg.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");
    logs_avg.push(`|  Code  | Latest |  MA10  |  MA20  |  MA30  |  MA60  |  MA90  |  MA120 |  MA150 |  MA180 |  MA210 |  MA240 |  MA270 |              Name             |`);
    logs_avg.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");
    logs_min.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");
    logs_min.push(`|  Code  | Latest |  MIN10 |  MIN20 |  MIN30 |  MIN60 |  MIN90 | MIN120 | MIN150 | MIN180 | MIN210 | MIN240 | MIN270 |              Name             |`);
    logs_min.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");
    logs_max.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");
    logs_max.push(`|  Code  | Latest |  MAX10 |  MAX20 |  MAX30 |  MAX60 |  MAX90 | MAX120 | MAX150 | MAX180 | MAX210 | MAX240 | MAX270 |              Name             |`);
    logs_max.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");

    /*
        let qh_log = `| ${info["子名称"]} - 开盘价:${info["开盘价"]} 最新价:${info["最新价"]} [${info["最低价"]} ~${info["最高价"]} ] ${info["多空态"]}头 ${info["强度比"]} 波动:${info["波动量"]} 回撤:${info["回撤比"]}% |`;

        logs.push(qh_log);
    }

    logs.push("+---------------------------------------------------------------------------------+---------------------|");
    logs.push("");
    */

    for (let elem of fund_list.res) {
        let info = {
            "Latest" : data_latest_jjjz[elem.code].jjjz.toFixed(4),
            "MA__10" : data_010_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA__20" : data_020_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA__30" : data_030_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA__60" : data_060_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA__90" : data_090_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA_120" : data_120_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA_150" : data_150_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA_180" : data_180_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA_210" : data_210_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA_240" : data_240_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MA_270" : data_270_avg_jjjz[elem.code].jjjz.toFixed(4),
            "MIN_10" : data_010_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN_20" : data_020_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN_30" : data_030_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN_60" : data_060_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN_90" : data_090_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN120" : data_120_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN150" : data_150_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN180" : data_180_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN210" : data_210_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN240" : data_240_min_jjjz[elem.code].jjjz.toFixed(4),
            "MIN270" : data_270_min_jjjz[elem.code].jjjz.toFixed(4),
            "MAX_10" : data_010_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX_20" : data_020_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX_30" : data_030_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX_60" : data_060_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX_90" : data_090_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX120" : data_120_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX150" : data_150_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX180" : data_180_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX210" : data_210_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX240" : data_240_max_jjjz[elem.code].jjjz.toFixed(4),
            "MAX270" : data_270_max_jjjz[elem.code].jjjz.toFixed(4),
        }
        let log_ma  = `| ${elem.code} | ${info.Latest} | ${info.MA__10} | ${info.MA__20} | ${info.MA__30} | ${info.MA__60} | ${info.MA__90} | ${info.MA_120} | ${info.MA_150} | ${info.MA_180} | ${info.MA_210} | ${info.MA_240} | ${info.MA_270} | ${elem.name}`;
        let log_min = `| ${elem.code} | ${info.Latest} | ${info.MIN_10} | ${info.MIN_20} | ${info.MIN_30} | ${info.MIN_60} | ${info.MIN_90} | ${info.MIN120} | ${info.MIN150} | ${info.MIN180} | ${info.MIN210} | ${info.MIN240} | ${info.MIN270} | ${elem.name}`;
        let log_max = `| ${elem.code} | ${info.Latest} | ${info.MAX_10} | ${info.MAX_20} | ${info.MAX_30} | ${info.MAX_60} | ${info.MAX_90} | ${info.MAX120} | ${info.MAX150} | ${info.MAX180} | ${info.MAX210} | ${info.MAX240} | ${info.MAX270} | ${elem.name}`;

        logs_avg.push(log_ma);
        logs_min.push(log_min);
        logs_max.push(log_max);
    }

    logs_avg.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");
    logs_min.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");
    logs_max.push("+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+-------------------------------+");

    for (let log of logs_avg) { console.log(log) }
    for (let log of logs_min) { console.log(log) }
    for (let log of logs_max) { console.log(log) }

    return {
        "err" : false,
        "res" : [],
    };
};

module.exports = fn_get_focus_main_info;
