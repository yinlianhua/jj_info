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
const fn_log_fund_main = async (date) => {
    let fn_get_fund_main_list = require("./fn_get_fund_main_list");

    let main_list = await fn_get_fund_main_list(date);

    if (main_list.err) {
        return {
            "err" : true,
            "res" : main_list.res,
        }
    }

    // 获取主要信息
    // 1.当前最新值
    // 2.30/60/90/120/150/180日均值,
    // 3.30/60/90/120/150/180日最大/最小值,
    // TODO:
    // 4.回撤比 = (MAX-CUR) / (MAX-MIN) * 100%
    // 5.反弹比 = (CUR-MIN) / (MAX-MIN) * 100%
    let logs = [];

    for (let elem of main_list.res) {
        // 当前值 大于等于 ma 值, 红色,否则绿色
        let c_avg005 = elem.latest >= elem.avg005 ? "red" : "green";
        let c_avg010 = elem.latest >= elem.avg010 ? "red" : "green";
        let c_avg015 = elem.latest >= elem.avg015 ? "red" : "green";
        let c_avg020 = elem.latest >= elem.avg020 ? "red" : "green";
        let c_avg025 = elem.latest >= elem.avg025 ? "red" : "green";
        let c_avg030 = elem.latest >= elem.avg030 ? "red" : "green";
        let c_avg060 = elem.latest >= elem.avg060 ? "red" : "green";
        let c_avg090 = elem.latest >= elem.avg090 ? "red" : "green";
        let c_avg120 = elem.latest >= elem.avg120 ? "red" : "green";
        let c_avg150 = elem.latest >= elem.avg150 ? "red" : "green";
        let c_avg180 = elem.latest >= elem.avg180 ? "red" : "green";
        let c_avg210 = elem.latest >= elem.avg210 ? "red" : "green";
        let c_avg240 = elem.latest >= elem.avg240 ? "red" : "green";
        let c_avg270 = elem.latest >= elem.avg270 ? "red" : "green";

        // 当前值 小于等于 min 值, 红色,否则绿色
        let c_min005 = elem.latest <= elem.min005 ? "red" : "green";
        let c_min010 = elem.latest <= elem.min010 ? "red" : "green";
        let c_min015 = elem.latest <= elem.min015 ? "red" : "green";
        let c_min020 = elem.latest <= elem.min020 ? "red" : "green";
        let c_min025 = elem.latest <= elem.min025 ? "red" : "green";
        let c_min030 = elem.latest <= elem.min030 ? "red" : "green";
        let c_min060 = elem.latest <= elem.min060 ? "red" : "green";
        let c_min090 = elem.latest <= elem.min090 ? "red" : "green";
        let c_min120 = elem.latest <= elem.min120 ? "red" : "green";
        let c_min150 = elem.latest <= elem.min150 ? "red" : "green";
        let c_min180 = elem.latest <= elem.min180 ? "red" : "green";
        let c_min210 = elem.latest <= elem.min210 ? "red" : "green";
        let c_min240 = elem.latest <= elem.min240 ? "red" : "green";
        let c_min270 = elem.latest <= elem.min270 ? "red" : "green";

        // 当前值 大于等于 max 值, 红色,否则绿色
        let c_max005 = elem.latest >= elem.max005 ? "red" : "green";
        let c_max010 = elem.latest >= elem.max010 ? "red" : "green";
        let c_max015 = elem.latest >= elem.max015 ? "red" : "green";
        let c_max020 = elem.latest >= elem.max020 ? "red" : "green";
        let c_max025 = elem.latest >= elem.max025 ? "red" : "green";
        let c_max030 = elem.latest >= elem.max030 ? "red" : "green";
        let c_max060 = elem.latest >= elem.max060 ? "red" : "green";
        let c_max090 = elem.latest >= elem.max090 ? "red" : "green";
        let c_max120 = elem.latest >= elem.max120 ? "red" : "green";
        let c_max150 = elem.latest >= elem.max150 ? "red" : "green";
        let c_max180 = elem.latest >= elem.max180 ? "red" : "green";
        let c_max210 = elem.latest >= elem.max210 ? "red" : "green";
        let c_max240 = elem.latest >= elem.max240 ? "red" : "green";
        let c_max270 = elem.latest >= elem.max270 ? "red" : "green";

        let r_005 = parseInt((elem.latest - elem.min005) / (elem.max005 - elem.min005) * 100);
        let r_010 = parseInt((elem.latest - elem.min010) / (elem.max010 - elem.min010) * 100);
        let r_015 = parseInt((elem.latest - elem.min015) / (elem.max015 - elem.min015) * 100);
        let r_020 = parseInt((elem.latest - elem.min020) / (elem.max020 - elem.min020) * 100);
        let r_025 = parseInt((elem.latest - elem.min025) / (elem.max025 - elem.min025) * 100);
        let r_030 = parseInt((elem.latest - elem.min030) / (elem.max030 - elem.min030) * 100);
        let r_060 = parseInt((elem.latest - elem.min060) / (elem.max060 - elem.min060) * 100);
        let r_090 = parseInt((elem.latest - elem.min090) / (elem.max090 - elem.min090) * 100);
        let r_120 = parseInt((elem.latest - elem.min120) / (elem.max120 - elem.min120) * 100);
        let r_150 = parseInt((elem.latest - elem.min150) / (elem.max150 - elem.min150) * 100);
        let r_180 = parseInt((elem.latest - elem.min180) / (elem.max180 - elem.min180) * 100);
        let r_210 = parseInt((elem.latest - elem.min210) / (elem.max210 - elem.min210) * 100);
        let r_240 = parseInt((elem.latest - elem.min240) / (elem.max240 - elem.min240) * 100);
        let r_270 = parseInt((elem.latest - elem.min270) / (elem.max270 - elem.min270) * 100);

        let c_005 = r_005 >= 70 ? "red" : (r_005 <= 30 ? "green" : "white");
        let c_010 = r_010 >= 70 ? "red" : (r_010 <= 30 ? "green" : "white");
        let c_015 = r_015 >= 70 ? "red" : (r_015 <= 30 ? "green" : "white");
        let c_020 = r_020 >= 70 ? "red" : (r_020 <= 30 ? "green" : "white");
        let c_025 = r_025 >= 70 ? "red" : (r_025 <= 30 ? "green" : "white");
        let c_030 = r_030 >= 70 ? "red" : (r_030 <= 30 ? "green" : "white");
        let c_060 = r_060 >= 70 ? "red" : (r_060 <= 30 ? "green" : "white");
        let c_090 = r_090 >= 70 ? "red" : (r_090 <= 30 ? "green" : "white");
        let c_120 = r_120 >= 70 ? "red" : (r_120 <= 30 ? "green" : "white");
        let c_150 = r_150 >= 70 ? "red" : (r_150 <= 30 ? "green" : "white");
        let c_180 = r_180 >= 70 ? "red" : (r_180 <= 30 ? "green" : "white");
        let c_210 = r_210 >= 70 ? "red" : (r_210 <= 30 ? "green" : "white");
        let c_240 = r_240 >= 70 ? "red" : (r_240 <= 30 ? "green" : "white");
        let c_270 = r_270 >= 70 ? "red" : (r_270 <= 30 ? "green" : "white");

        r_005 = (r_005+"%").padStart(4);
        r_010 = (r_010+"%").padStart(4);
        r_015 = (r_015+"%").padStart(4);
        r_020 = (r_020+"%").padStart(4);
        r_025 = (r_025+"%").padStart(4);
        r_030 = (r_030+"%").padStart(4);
        r_060 = (r_060+"%").padStart(4);
        r_090 = (r_090+"%").padStart(4);
        r_120 = (r_120+"%").padStart(4);
        r_150 = (r_150+"%").padStart(4);
        r_180 = (r_180+"%").padStart(4);
        r_210 = (r_210+"%").padStart(4);
        r_240 = (r_240+"%").padStart(4);
        r_270 = (r_270+"%").padStart(4);

        let c_score = elem.score > 0 ? "red" : "green";

        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|  Code  | Latest | Score  | ${chalk[c_score]((elem.score.toFixed(2)+"").padStart(6))} |       Name      |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`| ${chalk["yellow"](elem.code)} | ${chalk["yellow"](elem.latest)} | ${chalk["yellow"](elem.name)}`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push("|   Day  |   AVG  |   MIN  |   MAX  |  Rate  |  Star  |"); // min-max 区间
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|     5  | ${chalk[c_avg005](elem.avg005)} | ${chalk[c_min005](elem.min005)} | ${chalk[c_max005](elem.max005)} |  ${chalk[c_005](r_005)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|    10  | ${chalk[c_avg010](elem.avg010)} | ${chalk[c_min010](elem.min010)} | ${chalk[c_max010](elem.max010)} |  ${chalk[c_010](r_010)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|    15  | ${chalk[c_avg015](elem.avg015)} | ${chalk[c_min015](elem.min015)} | ${chalk[c_max015](elem.max015)} |  ${chalk[c_015](r_015)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|    20  | ${chalk[c_avg020](elem.avg020)} | ${chalk[c_min020](elem.min020)} | ${chalk[c_max020](elem.max020)} |  ${chalk[c_020](r_020)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|    25  | ${chalk[c_avg025](elem.avg025)} | ${chalk[c_min025](elem.min025)} | ${chalk[c_max025](elem.max025)} |  ${chalk[c_025](r_025)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|    30  | ${chalk[c_avg030](elem.avg030)} | ${chalk[c_min030](elem.min030)} | ${chalk[c_max030](elem.max030)} |  ${chalk[c_030](r_030)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|    60  | ${chalk[c_avg060](elem.avg060)} | ${chalk[c_min060](elem.min060)} | ${chalk[c_max060](elem.max060)} |  ${chalk[c_060](r_060)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|    90  | ${chalk[c_avg090](elem.avg090)} | ${chalk[c_min090](elem.min090)} | ${chalk[c_max090](elem.max090)} |  ${chalk[c_090](r_090)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|   120  | ${chalk[c_avg120](elem.avg120)} | ${chalk[c_min120](elem.min120)} | ${chalk[c_max120](elem.max120)} |  ${chalk[c_120](r_120)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|   150  | ${chalk[c_avg150](elem.avg150)} | ${chalk[c_min150](elem.min150)} | ${chalk[c_max150](elem.max150)} |  ${chalk[c_150](r_150)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|   180  | ${chalk[c_avg180](elem.avg180)} | ${chalk[c_min180](elem.min180)} | ${chalk[c_max180](elem.max180)} |  ${chalk[c_180](r_180)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|   210  | ${chalk[c_avg210](elem.avg210)} | ${chalk[c_min210](elem.min210)} | ${chalk[c_max210](elem.max210)} |  ${chalk[c_210](r_210)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|   240  | ${chalk[c_avg240](elem.avg240)} | ${chalk[c_min240](elem.min240)} | ${chalk[c_max240](elem.max240)} |  ${chalk[c_240](r_240)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push(`|   270  | ${chalk[c_avg270](elem.avg270)} | ${chalk[c_min270](elem.min270)} | ${chalk[c_max270](elem.max270)} |  ${chalk[c_270](r_270)}  |        |`);
        logs.push("+--------+--------------------------------------------+");
        logs.push("");
    }

    return {
        "err" : false,
        "res" : logs,
    };
};

module.exports = fn_log_fund_main;
