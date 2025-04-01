/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let chalk  = require("chalk");
let config = require("../config.json");
let db     = require('../core/sqlite3');

// 获取关注基金主要信息
const fn_log_fund_main_v2 = async (codes=[], date="") => {
    let fn_get_fund_main_list = require("./fn_get_fund_main_list");

    let main_list = await fn_get_fund_main_list(date);

    if (main_list.err) {
        return {
            "err" : true,
            "res" : main_list.res,
        }
    }

    main_list = _.groupBy(main_list.res, "code");

    let code_map = {};

    for (let code of codes) { code_map[code] = 1; }

    // 获取主要信息
    // 1.当前最新值
    // 2.30/60/90/120/150/180/210日均值,
    // 3.30/60/90/120/150/180/210日最大/最小值,
    // TODO:
    // 4.回撤比 = (MAX-CUR) / (MAX-MIN) * 100%
    // 5.反弹比 = (CUR-MIN) / (MAX-MIN) * 100%
    let res  = [];
    let logs = [];

    logs.push("+------------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------------------+");
    logs.push(`|            |  Code  |   Net  |  Score | AVG005 | AVG010 | AVG015 | AVG020 | AVG025 | AVG030 | AVG060 | AVG090 | AVG120 | AVG150 |     MIN-MAX 030    |     MIN-MAX 060    |     MIN-MAX 090    |     MIN-MAX 120    |     MIN-MAX 150    |     MIN-MAX 180    |     MIN-MAX 210    |             Name               |`);
    logs.push("+------------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------------------+");

    for (let [key, infos] of Object.entries(main_list)) {
        if (codes.length != 0 && code_map[key] == undefined) {
            continue;
        }

        // 先做数据处理
        for (let elem of infos.reverse()) {
            elem.c_code   = "yellow";
            elem.c_latest = "yellow";
            elem.c_name   = "yellow";
            elem.c_score  = elem.score > 0 ? "red" : "green";

            // 当前值 大于等于 ma 值, 红色,否则绿色
            elem.c_avg005 = elem.latest >= elem.avg005 ? "red" : "green";
            elem.c_avg010 = elem.latest >= elem.avg010 ? "red" : "green";
            elem.c_avg015 = elem.latest >= elem.avg015 ? "red" : "green";
            elem.c_avg020 = elem.latest >= elem.avg020 ? "red" : "green";
            elem.c_avg025 = elem.latest >= elem.avg025 ? "red" : "green";
            elem.c_avg030 = elem.latest >= elem.avg030 ? "red" : "green";
            elem.c_avg060 = elem.latest >= elem.avg060 ? "red" : "green";
            elem.c_avg090 = elem.latest >= elem.avg090 ? "red" : "green";
            elem.c_avg120 = elem.latest >= elem.avg120 ? "red" : "green";
            elem.c_avg150 = elem.latest >= elem.avg150 ? "red" : "green";

            // 当前值 小于等于 min 值, 红色,否则绿色
            elem.c_min030 = elem.latest <= elem.min030 ? "red" : "green";
            elem.c_min060 = elem.latest <= elem.min060 ? "red" : "green";
            elem.c_min090 = elem.latest <= elem.min090 ? "red" : "green";
            elem.c_min120 = elem.latest <= elem.min120 ? "red" : "green";
            elem.c_min150 = elem.latest <= elem.min150 ? "red" : "green";
            elem.c_min180 = elem.latest <= elem.min180 ? "red" : "green";
            elem.c_min210 = elem.latest <= elem.min210 ? "red" : "green";

            // 当前值 大于等于 max 值, 红色,否则绿色
            elem.c_max030 = elem.latest >= elem.max030 ? "red" : "green";
            elem.c_max060 = elem.latest >= elem.max060 ? "red" : "green";
            elem.c_max090 = elem.latest >= elem.max090 ? "red" : "green";
            elem.c_max120 = elem.latest >= elem.max120 ? "red" : "green";
            elem.c_max150 = elem.latest >= elem.max150 ? "red" : "green";
            elem.c_max180 = elem.latest >= elem.max180 ? "red" : "green";
            elem.c_max210 = elem.latest >= elem.max210 ? "red" : "green";

            elem.r_005 = parseInt((elem.latest - elem.min005) / (elem.max005 - elem.min005) * 100);
            elem.r_010 = parseInt((elem.latest - elem.min010) / (elem.max010 - elem.min010) * 100);
            elem.r_015 = parseInt((elem.latest - elem.min015) / (elem.max015 - elem.min015) * 100);
            elem.r_020 = parseInt((elem.latest - elem.min020) / (elem.max020 - elem.min020) * 100);
            elem.r_025 = parseInt((elem.latest - elem.min025) / (elem.max025 - elem.min025) * 100);
            elem.r_030 = parseInt((elem.latest - elem.min030) / (elem.max030 - elem.min030) * 100);
            elem.r_060 = parseInt((elem.latest - elem.min060) / (elem.max060 - elem.min060) * 100);
            elem.r_090 = parseInt((elem.latest - elem.min090) / (elem.max090 - elem.min090) * 100);
            elem.r_120 = parseInt((elem.latest - elem.min120) / (elem.max120 - elem.min120) * 100);
            elem.r_150 = parseInt((elem.latest - elem.min150) / (elem.max150 - elem.min150) * 100);
            elem.r_180 = parseInt((elem.latest - elem.min180) / (elem.max180 - elem.min180) * 100);
            elem.r_210 = parseInt((elem.latest - elem.min210) / (elem.max210 - elem.min210) * 100);

            elem.c_005 = elem.r_005 >= 70 ? "red" : (elem.r_005 <= 30 ? "green" : "white");
            elem.c_010 = elem.r_010 >= 70 ? "red" : (elem.r_010 <= 30 ? "green" : "white");
            elem.c_015 = elem.r_015 >= 70 ? "red" : (elem.r_015 <= 30 ? "green" : "white");
            elem.c_020 = elem.r_020 >= 70 ? "red" : (elem.r_020 <= 30 ? "green" : "white");
            elem.c_025 = elem.r_025 >= 70 ? "red" : (elem.r_025 <= 30 ? "green" : "white");
            elem.c_030 = elem.r_030 >= 70 ? "red" : (elem.r_030 <= 30 ? "green" : "white");
            elem.c_060 = elem.r_060 >= 70 ? "red" : (elem.r_060 <= 30 ? "green" : "white");
            elem.c_090 = elem.r_090 >= 70 ? "red" : (elem.r_090 <= 30 ? "green" : "white");
            elem.c_120 = elem.r_120 >= 70 ? "red" : (elem.r_120 <= 30 ? "green" : "white");
            elem.c_150 = elem.r_150 >= 70 ? "red" : (elem.r_150 <= 30 ? "green" : "white");
            elem.c_180 = elem.r_180 >= 70 ? "red" : (elem.r_180 <= 30 ? "green" : "white");
            elem.c_210 = elem.r_210 >= 70 ? "red" : (elem.r_210 <= 30 ? "green" : "white");

            elem.s_005 = (elem.r_005+"%").padStart(4);
            elem.s_010 = (elem.r_010+"%").padStart(4);
            elem.s_015 = (elem.r_015+"%").padStart(4);
            elem.s_020 = (elem.r_020+"%").padStart(4);
            elem.s_025 = (elem.r_025+"%").padStart(4);
            elem.s_030 = (elem.r_030+"%").padStart(4);
            elem.s_060 = (elem.r_060+"%").padStart(4);
            elem.s_090 = (elem.r_090+"%").padStart(4);
            elem.s_120 = (elem.r_120+"%").padStart(4);
            elem.s_150 = (elem.r_150+"%").padStart(4);
            elem.s_180 = (elem.r_180+"%").padStart(4);
            elem.s_210 = (elem.r_210+"%").padStart(4);

            res.push(elem);
        }
    }

    res = _.sortBy(res, "score");

    for (let elem of res) {
        let f_score  = chalk[elem.c_score]((elem.score.toFixed(2)+"").padStart(6));
        let f_code   = chalk[elem.c_code](elem.code);
        let f_latest = chalk[elem.c_latest](elem.latest);
        let f_name   = chalk[elem.c_name](elem.name);
        let f_avg005 = chalk[elem.c_avg005](elem.avg005);
        let f_avg010 = chalk[elem.c_avg010](elem.avg010);
        let f_avg015 = chalk[elem.c_avg015](elem.avg015);
        let f_avg020 = chalk[elem.c_avg020](elem.avg020);
        let f_avg025 = chalk[elem.c_avg025](elem.avg025);
        let f_avg030 = chalk[elem.c_avg030](elem.avg030);
        let f_avg060 = chalk[elem.c_avg060](elem.avg060);
        let f_avg090 = chalk[elem.c_avg090](elem.avg090);
        let f_avg120 = chalk[elem.c_avg120](elem.avg120);
        let f_avg150 = chalk[elem.c_avg150](elem.avg150);

        let f_min030 = chalk[elem.c_min030](elem.min030);
        let f_min060 = chalk[elem.c_min060](elem.min060);
        let f_min090 = chalk[elem.c_min090](elem.min090);
        let f_min120 = chalk[elem.c_min120](elem.min120);
        let f_min150 = chalk[elem.c_min150](elem.min150);
        let f_min180 = chalk[elem.c_min180](elem.min180);
        let f_min210 = chalk[elem.c_min210](elem.min210);

        let f_max030 = chalk[elem.c_max030](elem.max030);
        let f_max060 = chalk[elem.c_max060](elem.max060);
        let f_max090 = chalk[elem.c_max090](elem.max090);
        let f_max120 = chalk[elem.c_max120](elem.max120);
        let f_max150 = chalk[elem.c_max150](elem.max150);
        let f_max180 = chalk[elem.c_max180](elem.max180);
        let f_max210 = chalk[elem.c_max210](elem.max210);

        let f_r030   = chalk[elem.c_030](elem.s_030);
        let f_r060   = chalk[elem.c_060](elem.s_060);
        let f_r090   = chalk[elem.c_090](elem.s_090);
        let f_r120   = chalk[elem.c_120](elem.s_120);
        let f_r150   = chalk[elem.c_150](elem.s_150);
        let f_r180   = chalk[elem.c_180](elem.s_180);
        let f_r210   = chalk[elem.c_210](elem.s_210);
        
        logs.push(`| ${elem.date} | ${f_code} | ${f_latest} | ${f_score} | ${f_avg005} | ${f_avg010} | ${f_avg015} | ${f_avg020} | ${f_avg025} | ${f_avg030} | ${f_avg060} | ${f_avg090} | ${f_avg120} | ${f_avg150} | ${f_min030}~${f_max030} ${f_r030} | ${f_min060}~${f_max060} ${f_r060} | ${f_min090}~${f_max090} ${f_r090} | ${f_min120}~${f_max120} ${f_r120} | ${f_min150}~${f_max150} ${f_r150} | ${f_min180}~${f_max180} ${f_r180} | ${f_min210}~${f_max210} ${f_r210} | ${f_name}`);
        logs.push("+------------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------------------+");
    }

    for (let log of logs) {
        console.log(log);

        if (log == "") {
            await sleep(1000);
        }
    }

    return {
        "err" : false,
        "res" : res,
    };
};

module.exports = fn_log_fund_main_v2;
