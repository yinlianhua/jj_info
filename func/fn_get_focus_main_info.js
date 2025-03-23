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
        let latest  = data_latest_jjjz[elem.code].jjjz;
        let ma__10  = data_010_avg_jjjz[elem.code].jjjz;
        let ma__20  = data_020_avg_jjjz[elem.code].jjjz;
        let ma__30  = data_030_avg_jjjz[elem.code].jjjz;
        let ma__60  = data_060_avg_jjjz[elem.code].jjjz;
        let ma__90  = data_090_avg_jjjz[elem.code].jjjz;
        let ma_120  = data_120_avg_jjjz[elem.code].jjjz;
        let ma_150  = data_150_avg_jjjz[elem.code].jjjz;
        let ma_180  = data_180_avg_jjjz[elem.code].jjjz;
        let ma_210  = data_210_avg_jjjz[elem.code].jjjz;
        let ma_240  = data_240_avg_jjjz[elem.code].jjjz;
        let ma_270  = data_270_avg_jjjz[elem.code].jjjz;
        let min_10  = data_010_min_jjjz[elem.code].jjjz;
        let min_20  = data_020_min_jjjz[elem.code].jjjz;
        let min_30  = data_030_min_jjjz[elem.code].jjjz;
        let min_60  = data_060_min_jjjz[elem.code].jjjz;
        let min_90  = data_090_min_jjjz[elem.code].jjjz;
        let min120  = data_120_min_jjjz[elem.code].jjjz;
        let min150  = data_150_min_jjjz[elem.code].jjjz;
        let min180  = data_180_min_jjjz[elem.code].jjjz;
        let min210  = data_210_min_jjjz[elem.code].jjjz;
        let min240  = data_240_min_jjjz[elem.code].jjjz;
        let min270  = data_270_min_jjjz[elem.code].jjjz;
        let max_10  = data_010_max_jjjz[elem.code].jjjz;
        let max_20  = data_020_max_jjjz[elem.code].jjjz;
        let max_30  = data_030_max_jjjz[elem.code].jjjz;
        let max_60  = data_060_max_jjjz[elem.code].jjjz;
        let max_90  = data_090_max_jjjz[elem.code].jjjz;
        let max120  = data_120_max_jjjz[elem.code].jjjz;
        let max150  = data_150_max_jjjz[elem.code].jjjz;
        let max180  = data_180_max_jjjz[elem.code].jjjz;
        let max210  = data_210_max_jjjz[elem.code].jjjz;
        let max240  = data_240_max_jjjz[elem.code].jjjz;
        let max270  = data_270_max_jjjz[elem.code].jjjz;

        let cma__10 = ma__10 > latest ? "red" : (ma__10 < latest ? "green" : "white");
        let cma__20 = ma__20 > latest ? "red" : (ma__20 < latest ? "green" : "white");
        let cma__30 = ma__30 > latest ? "red" : (ma__30 < latest ? "green" : "white");
        let cma__60 = ma__60 > latest ? "red" : (ma__60 < latest ? "green" : "white");
        let cma__90 = ma__90 > latest ? "red" : (ma__90 < latest ? "green" : "white");
        let cma_120 = ma_120 > latest ? "red" : (ma_120 < latest ? "green" : "white");
        let cma_150 = ma_150 > latest ? "red" : (ma_150 < latest ? "green" : "white");
        let cma_180 = ma_180 > latest ? "red" : (ma_180 < latest ? "green" : "white");
        let cma_210 = ma_210 > latest ? "red" : (ma_210 < latest ? "green" : "white");
        let cma_240 = ma_240 > latest ? "red" : (ma_240 < latest ? "green" : "white");
        let cma_270 = ma_270 > latest ? "red" : (ma_270 < latest ? "green" : "white");

        let cmin_10 = min_10 > latest ? "red" : (min_10 < latest ? "green" : "white");
        let cmin_20 = min_20 > latest ? "red" : (min_20 < latest ? "green" : "white");
        let cmin_30 = min_30 > latest ? "red" : (min_30 < latest ? "green" : "white");
        let cmin_60 = min_60 > latest ? "red" : (min_60 < latest ? "green" : "white");
        let cmin_90 = min_90 > latest ? "red" : (min_90 < latest ? "green" : "white");
        let cmin120 = min120 > latest ? "red" : (min120 < latest ? "green" : "white");
        let cmin150 = min150 > latest ? "red" : (min150 < latest ? "green" : "white");
        let cmin180 = min180 > latest ? "red" : (min180 < latest ? "green" : "white");
        let cmin210 = min210 > latest ? "red" : (min210 < latest ? "green" : "white");
        let cmin240 = min240 > latest ? "red" : (min240 < latest ? "green" : "white");
        let cmin270 = min270 > latest ? "red" : (min270 < latest ? "green" : "white");

        let cmax_10 = max_10 > latest ? "red" : (max_10 < latest ? "green" : "white");
        let cmax_20 = max_20 > latest ? "red" : (max_20 < latest ? "green" : "white");
        let cmax_30 = max_30 > latest ? "red" : (max_30 < latest ? "green" : "white");
        let cmax_60 = max_60 > latest ? "red" : (max_60 < latest ? "green" : "white");
        let cmax_90 = max_90 > latest ? "red" : (max_90 < latest ? "green" : "white");
        let cmax120 = max120 > latest ? "red" : (max120 < latest ? "green" : "white");
        let cmax150 = max150 > latest ? "red" : (max150 < latest ? "green" : "white");
        let cmax180 = max180 > latest ? "red" : (max180 < latest ? "green" : "white");
        let cmax210 = max210 > latest ? "red" : (max210 < latest ? "green" : "white");
        let cmax240 = max240 > latest ? "red" : (max240 < latest ? "green" : "white");
        let cmax270 = max270 > latest ? "red" : (max270 < latest ? "green" : "white");

        let info = {
            "Latest"  : latest.toFixed(4),
            "MA__10"  : ma__10.toFixed(4),
            "MA__20"  : ma__20.toFixed(4),
            "MA__30"  : ma__30.toFixed(4),
            "MA__60"  : ma__60.toFixed(4),
            "MA__90"  : ma__90.toFixed(4),
            "MA_120"  : ma_120.toFixed(4),
            "MA_150"  : ma_150.toFixed(4),
            "MA_180"  : ma_180.toFixed(4),
            "MA_210"  : ma_210.toFixed(4),
            "MA_240"  : ma_240.toFixed(4),
            "MA_270"  : ma_270.toFixed(4),
            "MIN_10"  : min_10.toFixed(4),
            "MIN_20"  : min_20.toFixed(4),
            "MIN_30"  : min_30.toFixed(4),
            "MIN_60"  : min_60.toFixed(4),
            "MIN_90"  : min_90.toFixed(4),
            "MIN120"  : min120.toFixed(4),
            "MIN150"  : min150.toFixed(4),
            "MIN180"  : min180.toFixed(4),
            "MIN210"  : min210.toFixed(4),
            "MIN240"  : min240.toFixed(4),
            "MIN270"  : min270.toFixed(4),
            "MAX_10"  : max_10.toFixed(4),
            "MAX_20"  : max_20.toFixed(4),
            "MAX_30"  : max_30.toFixed(4),
            "MAX_60"  : max_60.toFixed(4),
            "MAX_90"  : max_90.toFixed(4),
            "MAX120"  : max120.toFixed(4),
            "MAX150"  : max150.toFixed(4),
            "MAX180"  : max180.toFixed(4),
            "MAX210"  : max210.toFixed(4),
            "MAX240"  : max240.toFixed(4),
            "MAX270"  : max270.toFixed(4),
            "CMA__10" : cma__10,
            "CMA__20" : cma__20,
            "CMA__30" : cma__30,
            "CMA__60" : cma__60,
            "CMA__90" : cma__90,
            "CMA_120" : cma_120,
            "CMA_150" : cma_150,
            "CMA_180" : cma_180,
            "CMA_210" : cma_210,
            "CMA_240" : cma_240,
            "CMA_270" : cma_270,
            "CMIN_10" : cmin_10,
            "CMIN_20" : cmin_20,
            "CMIN_30" : cmin_30,
            "CMIN_60" : cmin_60,
            "CMIN_90" : cmin_90,
            "CMIN120" : cmin120,
            "CMIN150" : cmin150,
            "CMIN180" : cmin180,
            "CMIN210" : cmin210,
            "CMIN240" : cmin240,
            "CMIN270" : cmin270,
            "CMAX_10" : cmax_10,
            "CMAX_20" : cmax_20,
            "CMAX_30" : cmax_30,
            "CMAX_60" : cmax_60,
            "CMAX_90" : cmax_90,
            "CMAX120" : cmax120,
            "CMAX150" : cmax150,
            "CMAX180" : cmax180,
            "CMAX210" : cmax210,
            "CMAX240" : cmax240,
            "CMAX270" : cmax270,
        }

        let log_ma  = `| ${elem.code} | ${info.Latest} | ${chalk[info.CMA__10](info.MA__10)} | ${chalk[info.CMA__20](info.MA__20)} | ${chalk[info.CMA__30](info.MA__30)} | ${chalk[info.CMA__60](info.MA__60)} | ${chalk[info.CMA__90](info.MA__90)} | ${chalk[info.CMA_120](info.MA_120)} | ${chalk[info.CMA_150](info.MA_150)} | ${chalk[info.CMA_180](info.MA_180)} | ${chalk[info.CMA_210](info.MA_210)} | ${chalk[info.CMA_240](info.MA_240)} | ${chalk[info.CMA_270](info.MA_270)} | ${elem.name}`;
        let log_min = `| ${elem.code} | ${info.Latest} | ${chalk[info.CMIN_10](info.MIN_10)} | ${chalk[info.CMIN_20](info.MIN_20)} | ${chalk[info.CMIN_30](info.MIN_30)} | ${chalk[info.CMIN_60](info.MIN_60)} | ${chalk[info.CMIN_90](info.MIN_90)} | ${chalk[info.CMIN120](info.MIN120)} | ${chalk[info.CMIN150](info.MIN150)} | ${chalk[info.CMIN180](info.MIN180)} | ${chalk[info.CMIN210](info.MIN210)} | ${chalk[info.CMIN240](info.MIN240)} | ${chalk[info.CMIN270](info.MIN270)} | ${elem.name}`;
        let log_max = `| ${elem.code} | ${info.Latest} | ${chalk[info.CMAX_10](info.MAX_10)} | ${chalk[info.CMAX_20](info.MAX_20)} | ${chalk[info.CMAX_30](info.MAX_30)} | ${chalk[info.CMAX_60](info.MAX_60)} | ${chalk[info.CMAX_90](info.MAX_90)} | ${chalk[info.CMAX120](info.MAX120)} | ${chalk[info.CMAX150](info.MAX150)} | ${chalk[info.CMAX180](info.MAX180)} | ${chalk[info.CMAX210](info.MAX210)} | ${chalk[info.CMAX240](info.MAX240)} | ${chalk[info.CMAX270](info.MAX270)} | ${elem.name}`;

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
