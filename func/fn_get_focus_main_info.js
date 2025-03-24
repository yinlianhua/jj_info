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
    // TODO:
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

    let logs = [];

    for (let elem of fund_list.res) {
        let latest  = data_latest_jjjz[elem.code].jjjz;
        let ma___5  = data_005_avg_jjjz[elem.code].jjjz;
        let ma__10  = data_010_avg_jjjz[elem.code].jjjz;
        let ma__15  = data_015_avg_jjjz[elem.code].jjjz;
        let ma__20  = data_020_avg_jjjz[elem.code].jjjz;
        let ma__25  = data_025_avg_jjjz[elem.code].jjjz;
        let ma__30  = data_030_avg_jjjz[elem.code].jjjz;
        let ma__60  = data_060_avg_jjjz[elem.code].jjjz;
        let ma__90  = data_090_avg_jjjz[elem.code].jjjz;
        let ma_120  = data_120_avg_jjjz[elem.code].jjjz;
        let ma_150  = data_150_avg_jjjz[elem.code].jjjz;
        let ma_180  = data_180_avg_jjjz[elem.code].jjjz;
        let ma_210  = data_210_avg_jjjz[elem.code].jjjz;
        let ma_240  = data_240_avg_jjjz[elem.code].jjjz;
        let ma_270  = data_270_avg_jjjz[elem.code].jjjz;
        let ma_300  = data_300_avg_jjjz[elem.code].jjjz;
        let ma_330  = data_330_avg_jjjz[elem.code].jjjz;
        let ma_360  = data_360_avg_jjjz[elem.code].jjjz;

        let min__5  = data_005_min_jjjz[elem.code].jjjz;
        let min_10  = data_010_min_jjjz[elem.code].jjjz;
        let min_15  = data_015_min_jjjz[elem.code].jjjz;
        let min_20  = data_020_min_jjjz[elem.code].jjjz;
        let min_25  = data_025_min_jjjz[elem.code].jjjz;
        let min_30  = data_030_min_jjjz[elem.code].jjjz;
        let min_60  = data_060_min_jjjz[elem.code].jjjz;
        let min_90  = data_090_min_jjjz[elem.code].jjjz;
        let min120  = data_120_min_jjjz[elem.code].jjjz;
        let min150  = data_150_min_jjjz[elem.code].jjjz;
        let min180  = data_180_min_jjjz[elem.code].jjjz;
        let min210  = data_210_min_jjjz[elem.code].jjjz;
        let min240  = data_240_min_jjjz[elem.code].jjjz;
        let min270  = data_270_min_jjjz[elem.code].jjjz;
        let min300  = data_300_min_jjjz[elem.code].jjjz;
        let min330  = data_330_min_jjjz[elem.code].jjjz;
        let min360  = data_360_min_jjjz[elem.code].jjjz;

        let max__5  = data_005_max_jjjz[elem.code].jjjz;
        let max_10  = data_010_max_jjjz[elem.code].jjjz;
        let max_15  = data_015_max_jjjz[elem.code].jjjz;
        let max_20  = data_020_max_jjjz[elem.code].jjjz;
        let max_25  = data_025_max_jjjz[elem.code].jjjz;
        let max_30  = data_030_max_jjjz[elem.code].jjjz;
        let max_60  = data_060_max_jjjz[elem.code].jjjz;
        let max_90  = data_090_max_jjjz[elem.code].jjjz;
        let max120  = data_120_max_jjjz[elem.code].jjjz;
        let max150  = data_150_max_jjjz[elem.code].jjjz;
        let max180  = data_180_max_jjjz[elem.code].jjjz;
        let max210  = data_210_max_jjjz[elem.code].jjjz;
        let max240  = data_240_max_jjjz[elem.code].jjjz;
        let max270  = data_270_max_jjjz[elem.code].jjjz;
        let max300  = data_300_max_jjjz[elem.code].jjjz;
        let max330  = data_330_max_jjjz[elem.code].jjjz;
        let max360  = data_360_max_jjjz[elem.code].jjjz;

        // 当前值 大于等于 ma 值, 红色,否则绿色
        let cma___5 = latest >= ma___5 ? "red" : "green";
        let cma__10 = latest >= ma__10 ? "red" : "green";
        let cma__15 = latest >= ma__15 ? "red" : "green";
        let cma__20 = latest >= ma__20 ? "red" : "green";
        let cma__25 = latest >= ma__25 ? "red" : "green";
        let cma__30 = latest >= ma__30 ? "red" : "green";
        let cma__60 = latest >= ma__60 ? "red" : "green";
        let cma__90 = latest >= ma__90 ? "red" : "green";
        let cma_120 = latest >= ma_120 ? "red" : "green";
        let cma_150 = latest >= ma_150 ? "red" : "green";
        let cma_180 = latest >= ma_180 ? "red" : "green";
        let cma_210 = latest >= ma_210 ? "red" : "green";
        let cma_240 = latest >= ma_240 ? "red" : "green";
        let cma_270 = latest >= ma_270 ? "red" : "green";
        let cma_300 = latest >= ma_300 ? "red" : "green";
        let cma_330 = latest >= ma_330 ? "red" : "green";
        let cma_360 = latest >= ma_360 ? "red" : "green";

        // 当前值 小于等于 min 值, 红色,否则绿色
        let cmin__5 = latest <= min__5 ? "red" : "green";
        let cmin_10 = latest <= min_10 ? "red" : "green";
        let cmin_15 = latest <= min_15 ? "red" : "green";
        let cmin_20 = latest <= min_20 ? "red" : "green";
        let cmin_25 = latest <= min_25 ? "red" : "green";
        let cmin_30 = latest <= min_30 ? "red" : "green";
        let cmin_60 = latest <= min_60 ? "red" : "green";
        let cmin_90 = latest <= min_90 ? "red" : "green";
        let cmin120 = latest <= min120 ? "red" : "green";
        let cmin150 = latest <= min150 ? "red" : "green";
        let cmin180 = latest <= min180 ? "red" : "green";
        let cmin210 = latest <= min210 ? "red" : "green";
        let cmin240 = latest <= min240 ? "red" : "green";
        let cmin270 = latest <= min270 ? "red" : "green";
        let cmin300 = latest <= min300 ? "red" : "green";
        let cmin330 = latest <= min330 ? "red" : "green";
        let cmin360 = latest <= min360 ? "red" : "green";

        // 当前值 大于等于 max 值, 红色,否则绿色
        let cmax__5 = latest >= max__5 ? "red" : "green";
        let cmax_10 = latest >= max_10 ? "red" : "green";
        let cmax_15 = latest >= max_15 ? "red" : "green";
        let cmax_20 = latest >= max_20 ? "red" : "green";
        let cmax_25 = latest >= max_25 ? "red" : "green";
        let cmax_30 = latest >= max_30 ? "red" : "green";
        let cmax_60 = latest >= max_60 ? "red" : "green";
        let cmax_90 = latest >= max_90 ? "red" : "green";
        let cmax120 = latest >= max120 ? "red" : "green";
        let cmax150 = latest >= max150 ? "red" : "green";
        let cmax180 = latest >= max180 ? "red" : "green";
        let cmax210 = latest >= max210 ? "red" : "green";
        let cmax240 = latest >= max240 ? "red" : "green";
        let cmax270 = latest >= max270 ? "red" : "green";
        let cmax300 = latest >= max300 ? "red" : "green";
        let cmax330 = latest >= max330 ? "red" : "green";
        let cmax360 = latest >= max360 ? "red" : "green";

        let info = {
            "Code"    : elem.code,
            "Name"    : elem.name,
            "Latest"  : latest.toFixed(4),
            "MA___5"  : ma___5.toFixed(4),
            "MA__10"  : ma__10.toFixed(4),
            "MA__15"  : ma__15.toFixed(4),
            "MA__20"  : ma__20.toFixed(4),
            "MA__25"  : ma__25.toFixed(4),
            "MA__30"  : ma__30.toFixed(4),
            "MA__60"  : ma__60.toFixed(4),
            "MA__90"  : ma__90.toFixed(4),
            "MA_120"  : ma_120.toFixed(4),
            "MA_150"  : ma_150.toFixed(4),
            "MA_180"  : ma_180.toFixed(4),
            "MA_210"  : ma_210.toFixed(4),
            "MA_240"  : ma_240.toFixed(4),
            "MA_270"  : ma_270.toFixed(4),
            "MA_300"  : ma_300.toFixed(4),
            "MA_330"  : ma_330.toFixed(4),
            "MA_360"  : ma_360.toFixed(4),
            "MIN__5"  : min__5.toFixed(4),
            "MIN_10"  : min_10.toFixed(4),
            "MIN_15"  : min_15.toFixed(4),
            "MIN_20"  : min_20.toFixed(4),
            "MIN_25"  : min_25.toFixed(4),
            "MIN_30"  : min_30.toFixed(4),
            "MIN_60"  : min_60.toFixed(4),
            "MIN_90"  : min_90.toFixed(4),
            "MIN120"  : min120.toFixed(4),
            "MIN150"  : min150.toFixed(4),
            "MIN180"  : min180.toFixed(4),
            "MIN210"  : min210.toFixed(4),
            "MIN240"  : min240.toFixed(4),
            "MIN270"  : min270.toFixed(4),
            "MIN300"  : min300.toFixed(4),
            "MIN330"  : min330.toFixed(4),
            "MIN360"  : min360.toFixed(4),
            "MAX__5"  : max__5.toFixed(4),
            "MAX_10"  : max_10.toFixed(4),
            "MAX_15"  : max_15.toFixed(4),
            "MAX_20"  : max_20.toFixed(4),
            "MAX_25"  : max_25.toFixed(4),
            "MAX_30"  : max_30.toFixed(4),
            "MAX_60"  : max_60.toFixed(4),
            "MAX_90"  : max_90.toFixed(4),
            "MAX120"  : max120.toFixed(4),
            "MAX150"  : max150.toFixed(4),
            "MAX180"  : max180.toFixed(4),
            "MAX210"  : max210.toFixed(4),
            "MAX240"  : max240.toFixed(4),
            "MAX270"  : max270.toFixed(4),
            "MAX300"  : max300.toFixed(4),
            "MAX330"  : max330.toFixed(4),
            "MAX360"  : max360.toFixed(4),
            "CMA___5" : cma___5,
            "CMA__10" : cma__10,
            "CMA__15" : cma__15,
            "CMA__20" : cma__20,
            "CMA__25" : cma__25,
            "CMA__30" : cma__30,
            "CMA__60" : cma__60,
            "CMA__90" : cma__90,
            "CMA_120" : cma_120,
            "CMA_150" : cma_150,
            "CMA_180" : cma_180,
            "CMA_210" : cma_210,
            "CMA_240" : cma_240,
            "CMA_270" : cma_270,
            "CMA_300" : cma_300,
            "CMA_330" : cma_330,
            "CMA_360" : cma_360,
            "CMIN__5" : cmin__5,
            "CMIN_10" : cmin_10,
            "CMIN_15" : cmin_15,
            "CMIN_20" : cmin_20,
            "CMIN_25" : cmin_25,
            "CMIN_30" : cmin_30,
            "CMIN_60" : cmin_60,
            "CMIN_90" : cmin_90,
            "CMIN120" : cmin120,
            "CMIN150" : cmin150,
            "CMIN180" : cmin180,
            "CMIN210" : cmin210,
            "CMIN240" : cmin240,
            "CMIN270" : cmin270,
            "CMIN300" : cmin300,
            "CMIN330" : cmin330,
            "CMIN360" : cmin360,
            "CMAX__5" : cmax__5,
            "CMAX_10" : cmax_10,
            "CMAX_15" : cmax_15,
            "CMAX_20" : cmax_20,
            "CMAX_25" : cmax_25,
            "CMAX_30" : cmax_30,
            "CMAX_60" : cmax_60,
            "CMAX_90" : cmax_90,
            "CMAX120" : cmax120,
            "CMAX150" : cmax150,
            "CMAX180" : cmax180,
            "CMAX210" : cmax210,
            "CMAX240" : cmax240,
            "CMAX270" : cmax270,
            "CMAX300" : cmax300,
            "CMAX330" : cmax330,
            "CMAX360" : cmax360,
        }

        logs.push("+--------+--------+-----------------------------------+");
        logs.push("|  Code  | Latest |                 Name              |");
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`| ${chalk["yellow"](info.Code)} | ${chalk["yellow"](info.Latest)} | ${chalk["yellow"](info.Name)}`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push("|        |   Day  |   AVG  |   MIN  |   MAX  |  Rate  |");
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   01   |     5  | ${chalk[info.CMA___5](info.MA___5)} | ${chalk[info.CMIN__5](info.MIN__5)} | ${chalk[info.CMAX__5](info.MAX__5)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   02   |    10  | ${chalk[info.CMA__10](info.MA__10)} | ${chalk[info.CMIN_10](info.MIN_10)} | ${chalk[info.CMAX_10](info.MAX_10)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   03   |    15  | ${chalk[info.CMA__15](info.MA__15)} | ${chalk[info.CMIN_15](info.MIN_15)} | ${chalk[info.CMAX_15](info.MAX_15)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   04   |    20  | ${chalk[info.CMA__20](info.MA__20)} | ${chalk[info.CMIN_20](info.MIN_20)} | ${chalk[info.CMAX_20](info.MAX_20)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   05   |    25  | ${chalk[info.CMA__25](info.MA__25)} | ${chalk[info.CMIN_25](info.MIN_25)} | ${chalk[info.CMAX_25](info.MAX_25)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   06   |    30  | ${chalk[info.CMA__30](info.MA__30)} | ${chalk[info.CMIN_30](info.MIN_30)} | ${chalk[info.CMAX_30](info.MAX_30)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   07   |    60  | ${chalk[info.CMA__60](info.MA__60)} | ${chalk[info.CMIN_60](info.MIN_60)} | ${chalk[info.CMAX_60](info.MAX_60)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   08   |    90  | ${chalk[info.CMA__90](info.MA__90)} | ${chalk[info.CMIN_90](info.MIN_90)} | ${chalk[info.CMAX_90](info.MAX_90)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   09   |   120  | ${chalk[info.CMA_120](info.MA_120)} | ${chalk[info.CMIN120](info.MIN120)} | ${chalk[info.CMAX120](info.MAX120)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   10   |   150  | ${chalk[info.CMA_150](info.MA_150)} | ${chalk[info.CMIN150](info.MIN150)} | ${chalk[info.CMAX150](info.MAX150)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   11   |   180  | ${chalk[info.CMA_180](info.MA_180)} | ${chalk[info.CMIN180](info.MIN180)} | ${chalk[info.CMAX180](info.MAX180)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   12   |   210  | ${chalk[info.CMA_210](info.MA_210)} | ${chalk[info.CMIN210](info.MIN210)} | ${chalk[info.CMAX210](info.MAX210)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   13   |   240  | ${chalk[info.CMA_240](info.MA_240)} | ${chalk[info.CMIN240](info.MIN240)} | ${chalk[info.CMAX240](info.MAX240)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   14   |   270  | ${chalk[info.CMA_270](info.MA_270)} | ${chalk[info.CMIN270](info.MIN270)} | ${chalk[info.CMAX270](info.MAX270)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   15   |   300  | ${chalk[info.CMA_300](info.MA_300)} | ${chalk[info.CMIN300](info.MIN300)} | ${chalk[info.CMAX300](info.MAX300)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   16   |   330  | ${chalk[info.CMA_330](info.MA_330)} | ${chalk[info.CMIN330](info.MIN330)} | ${chalk[info.CMAX330](info.MAX330)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   17   |   360  | ${chalk[info.CMA_360](info.MA_360)} | ${chalk[info.CMIN360](info.MIN360)} | ${chalk[info.CMAX360](info.MAX360)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push("");
    }

    for (let log of logs) { console.log(log) }

    return {
        "err" : false,
        "res" : [],
    };
};

module.exports = fn_get_focus_main_info;
