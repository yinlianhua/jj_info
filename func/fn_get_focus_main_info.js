/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
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
        await db.close();
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
    // 4.回撤比 = (MAX-CUR) / (MAX-MIN) * 100%
    // 5.反弹比 = (CUR-MIN) / (MAX-MIN) * 100%

    let [
        data_latest_jjjz,
        data_005_avg_jjjz,
        data_010_avg_jjjz,
        data_015_avg_jjjz,
        data_020_avg_jjjz,
        data_025_avg_jjjz,
        data_030_avg_jjjz,
        data_060_avg_jjjz,
        data_090_avg_jjjz,
        data_120_avg_jjjz,
        data_150_avg_jjjz,
        data_180_avg_jjjz,
        data_210_avg_jjjz,
        data_240_avg_jjjz,
        data_270_avg_jjjz,
        data_300_avg_jjjz,
        data_330_avg_jjjz,
        data_360_avg_jjjz,
        data_005_min_jjjz,
        data_010_min_jjjz,
        data_015_min_jjjz,
        data_020_min_jjjz,
        data_025_min_jjjz,
        data_030_min_jjjz,
        data_060_min_jjjz,
        data_090_min_jjjz,
        data_120_min_jjjz,
        data_150_min_jjjz,
        data_180_min_jjjz,
        data_210_min_jjjz,
        data_240_min_jjjz,
        data_270_min_jjjz,
        data_300_min_jjjz,
        data_330_min_jjjz,
        data_360_min_jjjz,
        data_005_max_jjjz,
        data_010_max_jjjz,
        data_015_max_jjjz,
        data_020_max_jjjz,
        data_025_max_jjjz,
        data_030_max_jjjz,
        data_060_max_jjjz,
        data_090_max_jjjz,
        data_120_max_jjjz,
        data_150_max_jjjz,
        data_180_max_jjjz,
        data_210_max_jjjz,
        data_240_max_jjjz,
        data_270_max_jjjz,
        data_300_max_jjjz,
        data_330_max_jjjz,
        data_360_max_jjjz,
    ] = await Promise.all([
        db.get(sql_map.sql_latest_fund_jjjz_list),
        db.get(sql_map.sql_005_avg_fund_jjjz_list),
        db.get(sql_map.sql_010_avg_fund_jjjz_list),
        db.get(sql_map.sql_015_avg_fund_jjjz_list),
        db.get(sql_map.sql_020_avg_fund_jjjz_list),
        db.get(sql_map.sql_025_avg_fund_jjjz_list),
        db.get(sql_map.sql_030_avg_fund_jjjz_list),
        db.get(sql_map.sql_060_avg_fund_jjjz_list),
        db.get(sql_map.sql_090_avg_fund_jjjz_list),
        db.get(sql_map.sql_120_avg_fund_jjjz_list),
        db.get(sql_map.sql_150_avg_fund_jjjz_list),
        db.get(sql_map.sql_180_avg_fund_jjjz_list),
        db.get(sql_map.sql_210_avg_fund_jjjz_list),
        db.get(sql_map.sql_240_avg_fund_jjjz_list),
        db.get(sql_map.sql_270_avg_fund_jjjz_list),
        db.get(sql_map.sql_300_avg_fund_jjjz_list),
        db.get(sql_map.sql_330_avg_fund_jjjz_list),
        db.get(sql_map.sql_360_avg_fund_jjjz_list),
        db.get(sql_map.sql_005_min_fund_jjjz_list),
        db.get(sql_map.sql_010_min_fund_jjjz_list),
        db.get(sql_map.sql_015_min_fund_jjjz_list),
        db.get(sql_map.sql_020_min_fund_jjjz_list),
        db.get(sql_map.sql_025_min_fund_jjjz_list),
        db.get(sql_map.sql_030_min_fund_jjjz_list),
        db.get(sql_map.sql_060_min_fund_jjjz_list),
        db.get(sql_map.sql_090_min_fund_jjjz_list),
        db.get(sql_map.sql_120_min_fund_jjjz_list),
        db.get(sql_map.sql_150_min_fund_jjjz_list),
        db.get(sql_map.sql_180_min_fund_jjjz_list),
        db.get(sql_map.sql_210_min_fund_jjjz_list),
        db.get(sql_map.sql_240_min_fund_jjjz_list),
        db.get(sql_map.sql_270_min_fund_jjjz_list),
        db.get(sql_map.sql_300_min_fund_jjjz_list),
        db.get(sql_map.sql_330_min_fund_jjjz_list),
        db.get(sql_map.sql_360_min_fund_jjjz_list),
        db.get(sql_map.sql_005_max_fund_jjjz_list),
        db.get(sql_map.sql_010_max_fund_jjjz_list),
        db.get(sql_map.sql_015_max_fund_jjjz_list),
        db.get(sql_map.sql_020_max_fund_jjjz_list),
        db.get(sql_map.sql_025_max_fund_jjjz_list),
        db.get(sql_map.sql_030_max_fund_jjjz_list),
        db.get(sql_map.sql_060_max_fund_jjjz_list),
        db.get(sql_map.sql_090_max_fund_jjjz_list),
        db.get(sql_map.sql_120_max_fund_jjjz_list),
        db.get(sql_map.sql_150_max_fund_jjjz_list),
        db.get(sql_map.sql_180_max_fund_jjjz_list),
        db.get(sql_map.sql_210_max_fund_jjjz_list),
        db.get(sql_map.sql_240_max_fund_jjjz_list),
        db.get(sql_map.sql_270_max_fund_jjjz_list),
        db.get(sql_map.sql_300_max_fund_jjjz_list),
        db.get(sql_map.sql_330_max_fund_jjjz_list),
        db.get(sql_map.sql_360_max_fund_jjjz_list),
    ]);

    data_latest_jjjz  = _.indexBy(data_latest_jjjz.res, "code");

    data_005_avg_jjjz = _.indexBy(data_005_avg_jjjz.res, "code"); 
    data_010_avg_jjjz = _.indexBy(data_010_avg_jjjz.res, "code"); 
    data_015_avg_jjjz = _.indexBy(data_015_avg_jjjz.res, "code"); 
    data_020_avg_jjjz = _.indexBy(data_020_avg_jjjz.res, "code"); 
    data_025_avg_jjjz = _.indexBy(data_025_avg_jjjz.res, "code"); 
    data_030_avg_jjjz = _.indexBy(data_030_avg_jjjz.res, "code"); 
    data_060_avg_jjjz = _.indexBy(data_060_avg_jjjz.res, "code"); 
    data_090_avg_jjjz = _.indexBy(data_090_avg_jjjz.res, "code"); 
    data_120_avg_jjjz = _.indexBy(data_120_avg_jjjz.res, "code"); 
    data_150_avg_jjjz = _.indexBy(data_150_avg_jjjz.res, "code"); 
    data_180_avg_jjjz = _.indexBy(data_180_avg_jjjz.res, "code"); 
    data_210_avg_jjjz = _.indexBy(data_210_avg_jjjz.res, "code"); 
    data_240_avg_jjjz = _.indexBy(data_240_avg_jjjz.res, "code"); 
    data_270_avg_jjjz = _.indexBy(data_270_avg_jjjz.res, "code"); 
    data_300_avg_jjjz = _.indexBy(data_300_avg_jjjz.res, "code"); 
    data_330_avg_jjjz = _.indexBy(data_330_avg_jjjz.res, "code"); 
    data_360_avg_jjjz = _.indexBy(data_360_avg_jjjz.res, "code"); 

    data_005_min_jjjz = _.indexBy(data_005_min_jjjz.res, "code"); 
    data_010_min_jjjz = _.indexBy(data_010_min_jjjz.res, "code"); 
    data_015_min_jjjz = _.indexBy(data_015_min_jjjz.res, "code"); 
    data_020_min_jjjz = _.indexBy(data_020_min_jjjz.res, "code"); 
    data_025_min_jjjz = _.indexBy(data_025_min_jjjz.res, "code"); 
    data_030_min_jjjz = _.indexBy(data_030_min_jjjz.res, "code"); 
    data_060_min_jjjz = _.indexBy(data_060_min_jjjz.res, "code"); 
    data_090_min_jjjz = _.indexBy(data_090_min_jjjz.res, "code"); 
    data_120_min_jjjz = _.indexBy(data_120_min_jjjz.res, "code"); 
    data_150_min_jjjz = _.indexBy(data_150_min_jjjz.res, "code"); 
    data_180_min_jjjz = _.indexBy(data_180_min_jjjz.res, "code"); 
    data_210_min_jjjz = _.indexBy(data_210_min_jjjz.res, "code"); 
    data_240_min_jjjz = _.indexBy(data_240_min_jjjz.res, "code"); 
    data_270_min_jjjz = _.indexBy(data_270_min_jjjz.res, "code"); 
    data_300_min_jjjz = _.indexBy(data_300_min_jjjz.res, "code"); 
    data_330_min_jjjz = _.indexBy(data_330_min_jjjz.res, "code"); 
    data_360_min_jjjz = _.indexBy(data_360_min_jjjz.res, "code"); 

    data_005_max_jjjz = _.indexBy(data_005_max_jjjz.res, "code"); 
    data_010_max_jjjz = _.indexBy(data_010_max_jjjz.res, "code"); 
    data_015_max_jjjz = _.indexBy(data_015_max_jjjz.res, "code"); 
    data_020_max_jjjz = _.indexBy(data_020_max_jjjz.res, "code"); 
    data_025_max_jjjz = _.indexBy(data_025_max_jjjz.res, "code"); 
    data_030_max_jjjz = _.indexBy(data_030_max_jjjz.res, "code"); 
    data_060_max_jjjz = _.indexBy(data_060_max_jjjz.res, "code"); 
    data_090_max_jjjz = _.indexBy(data_090_max_jjjz.res, "code"); 
    data_120_max_jjjz = _.indexBy(data_120_max_jjjz.res, "code"); 
    data_150_max_jjjz = _.indexBy(data_150_max_jjjz.res, "code"); 
    data_180_max_jjjz = _.indexBy(data_180_max_jjjz.res, "code"); 
    data_210_max_jjjz = _.indexBy(data_210_max_jjjz.res, "code"); 
    data_240_max_jjjz = _.indexBy(data_240_max_jjjz.res, "code"); 
    data_270_max_jjjz = _.indexBy(data_270_max_jjjz.res, "code"); 
    data_300_max_jjjz = _.indexBy(data_300_max_jjjz.res, "code"); 
    data_330_max_jjjz = _.indexBy(data_330_max_jjjz.res, "code"); 
    data_360_max_jjjz = _.indexBy(data_360_max_jjjz.res, "code"); 

    let data = [];

    for (let elem of fund_list.res) {
        let latest  = data_latest_jjjz[elem.code].jjjz;

        let avg005  = data_005_avg_jjjz[elem.code].jjjz;
        let avg010  = data_010_avg_jjjz[elem.code].jjjz;
        let avg015  = data_015_avg_jjjz[elem.code].jjjz;
        let avg020  = data_020_avg_jjjz[elem.code].jjjz;
        let avg025  = data_025_avg_jjjz[elem.code].jjjz;
        let avg030  = data_030_avg_jjjz[elem.code].jjjz;
        let avg060  = data_060_avg_jjjz[elem.code].jjjz;
        let avg090  = data_090_avg_jjjz[elem.code].jjjz;
        let avg120  = data_120_avg_jjjz[elem.code].jjjz;
        let avg150  = data_150_avg_jjjz[elem.code].jjjz;
        let avg180  = data_180_avg_jjjz[elem.code].jjjz;
        let avg210  = data_210_avg_jjjz[elem.code].jjjz;
        let avg240  = data_240_avg_jjjz[elem.code].jjjz;
        let avg270  = data_270_avg_jjjz[elem.code].jjjz;
        let avg300  = data_300_avg_jjjz[elem.code].jjjz;
        let avg330  = data_330_avg_jjjz[elem.code].jjjz;
        let avg360  = data_360_avg_jjjz[elem.code].jjjz;

        let min005  = data_005_min_jjjz[elem.code].jjjz;
        let min010  = data_010_min_jjjz[elem.code].jjjz;
        let min015  = data_015_min_jjjz[elem.code].jjjz;
        let min020  = data_020_min_jjjz[elem.code].jjjz;
        let min025  = data_025_min_jjjz[elem.code].jjjz;
        let min030  = data_030_min_jjjz[elem.code].jjjz;
        let min060  = data_060_min_jjjz[elem.code].jjjz;
        let min090  = data_090_min_jjjz[elem.code].jjjz;
        let min120  = data_120_min_jjjz[elem.code].jjjz;
        let min150  = data_150_min_jjjz[elem.code].jjjz;
        let min180  = data_180_min_jjjz[elem.code].jjjz;
        let min210  = data_210_min_jjjz[elem.code].jjjz;
        let min240  = data_240_min_jjjz[elem.code].jjjz;
        let min270  = data_270_min_jjjz[elem.code].jjjz;
        let min300  = data_300_min_jjjz[elem.code].jjjz;
        let min330  = data_330_min_jjjz[elem.code].jjjz;
        let min360  = data_360_min_jjjz[elem.code].jjjz;

        let max005  = data_005_max_jjjz[elem.code].jjjz;
        let max010  = data_010_max_jjjz[elem.code].jjjz;
        let max015  = data_015_max_jjjz[elem.code].jjjz;
        let max020  = data_020_max_jjjz[elem.code].jjjz;
        let max025  = data_025_max_jjjz[elem.code].jjjz;
        let max030  = data_030_max_jjjz[elem.code].jjjz;
        let max060  = data_060_max_jjjz[elem.code].jjjz;
        let max090  = data_090_max_jjjz[elem.code].jjjz;
        let max120  = data_120_max_jjjz[elem.code].jjjz;
        let max150  = data_150_max_jjjz[elem.code].jjjz;
        let max180  = data_180_max_jjjz[elem.code].jjjz;
        let max210  = data_210_max_jjjz[elem.code].jjjz;
        let max240  = data_240_max_jjjz[elem.code].jjjz;
        let max270  = data_270_max_jjjz[elem.code].jjjz;
        let max300  = data_300_max_jjjz[elem.code].jjjz;
        let max330  = data_330_max_jjjz[elem.code].jjjz;
        let max360  = data_360_max_jjjz[elem.code].jjjz;

        let r_005 = (latest - min005) / (max005 - min005);
        let r_010 = (latest - min010) / (max010 - min010);
        let r_015 = (latest - min015) / (max015 - min015);
        let r_020 = (latest - min020) / (max020 - min020);
        let r_025 = (latest - min025) / (max025 - min025);
        let r_030 = (latest - min030) / (max030 - min030);
        let r_060 = (latest - min060) / (max060 - min060);
        let r_090 = (latest - min090) / (max090 - min090);
        let r_120 = (latest - min120) / (max120 - min120);
        let r_150 = (latest - min150) / (max150 - min150);
        let r_180 = (latest - min180) / (max180 - min180);
        let r_210 = (latest - min210) / (max210 - min210);
        let r_240 = (latest - min240) / (max240 - min240);
        let r_270 = (latest - min270) / (max270 - min270);

        // score 计算规则
        // 最新值在
        // 短期(5-30)
        // 高于 +分, 系数 = 1-rate
        // 低于 -分  系数 = rate
        // 长期(60-270)
        // 低于 +分  系数 = 1-rate
        // 高于 -分, 系数 = rate
        let score = 0.00;

        if (latest > avg005) { score += avg005 * (1 - r_005); }
        if (latest < avg005) { score -= avg005 *      r_005;  };
        if (latest > avg010) { score += avg010 * (1 - r_010); }
        if (latest < avg010) { score -= avg010 *      r_010;  };
        if (latest > avg015) { score += avg015 * (1 - r_015); }
        if (latest < avg015) { score -= avg015 *      r_015;  };
        if (latest > avg020) { score += avg020 * (1 - r_020); }
        if (latest < avg020) { score -= avg020 *      r_020;  };
        if (latest > avg025) { score += avg025 * (1 - r_025); }
        if (latest < avg025) { score -= avg025 *      r_025;  };
        if (latest > avg030) { score += avg030 * (1 - r_030); }
        if (latest < avg030) { score -= avg030 *      r_030;  };

        if (latest < avg060) { score += avg060 * (1 - r_060); }
        if (latest > avg060) { score -= avg060 *      r_060;  };
        if (latest < avg090) { score += avg090 * (1 - r_090); }
        if (latest > avg090) { score -= avg090 *      r_090;  };
        if (latest < avg120) { score += avg120 * (1 - r_120); }
        if (latest > avg120) { score -= avg120 *      r_120;  };
        if (latest < avg150) { score += avg150 * (1 - r_150); }
        if (latest > avg150) { score -= avg150 *      r_150;  };
        if (latest < avg180) { score += avg180 * (1 - r_180); }
        if (latest > avg180) { score -= avg180 *      r_180;  };
        if (latest < avg210) { score += avg210 * (1 - r_210); }
        if (latest > avg210) { score -= avg210 *      r_210;  };
        if (latest < avg240) { score += avg240 * (1 - r_240); }
        if (latest > avg240) { score -= avg240 *      r_240;  };
        if (latest < avg270) { score += avg270 * (1 - r_270); }
        if (latest > avg270) { score -= avg270 *      r_270;  };

        let info = {
            "code"   : elem.code,
            "name"   : elem.name,
            "latest" : latest.toFixed(4),
            "score"  : score.toFixed(2),
            "avg005" : avg005.toFixed(4),
            "avg010" : avg010.toFixed(4),
            "avg015" : avg015.toFixed(4),
            "avg020" : avg020.toFixed(4),
            "avg025" : avg025.toFixed(4),
            "avg030" : avg030.toFixed(4),
            "avg060" : avg060.toFixed(4),
            "avg090" : avg090.toFixed(4),
            "avg120" : avg120.toFixed(4),
            "avg150" : avg150.toFixed(4),
            "avg180" : avg180.toFixed(4),
            "avg210" : avg210.toFixed(4),
            "avg240" : avg240.toFixed(4),
            "avg270" : avg270.toFixed(4),
            "avg300" : avg300.toFixed(4),
            "avg330" : avg330.toFixed(4),
            "avg360" : avg360.toFixed(4),
            "min005" : min005.toFixed(4),
            "min010" : min010.toFixed(4),
            "min015" : min015.toFixed(4),
            "min020" : min020.toFixed(4),
            "min025" : min025.toFixed(4),
            "min030" : min030.toFixed(4),
            "min060" : min060.toFixed(4),
            "min090" : min090.toFixed(4),
            "min120" : min120.toFixed(4),
            "min150" : min150.toFixed(4),
            "min180" : min180.toFixed(4),
            "min210" : min210.toFixed(4),
            "min240" : min240.toFixed(4),
            "min270" : min270.toFixed(4),
            "min300" : min300.toFixed(4),
            "min330" : min330.toFixed(4),
            "min360" : min360.toFixed(4),
            "max005" : max005.toFixed(4),
            "max010" : max010.toFixed(4),
            "max015" : max015.toFixed(4),
            "max020" : max020.toFixed(4),
            "max025" : max025.toFixed(4),
            "max030" : max030.toFixed(4),
            "max060" : max060.toFixed(4),
            "max090" : max090.toFixed(4),
            "max120" : max120.toFixed(4),
            "max150" : max150.toFixed(4),
            "max180" : max180.toFixed(4),
            "max210" : max210.toFixed(4),
            "max240" : max240.toFixed(4),
            "max270" : max270.toFixed(4),
            "max300" : max300.toFixed(4),
            "max330" : max330.toFixed(4),
            "max360" : max360.toFixed(4),
        }

        data.push(info);
    }

    await db.close();

    return {
        "err" : false,
        "res" : data,
    };
};

module.exports = fn_get_focus_main_info;
