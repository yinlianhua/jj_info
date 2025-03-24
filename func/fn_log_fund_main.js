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

    let fn_get_fund_main_list = require("./fn_get_fund_main_list");

    let main_list = await fn_get_fund_main_list();

    if (main_list.err) {
        await db.close();

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
        let c_max300 = elem.latest >= elem.max300 ? "red" : "green";
        let c_max330 = elem.latest >= elem.max330 ? "red" : "green";
        let c_max360 = elem.latest >= elem.max360 ? "red" : "green";

        logs.push("+--------+--------+-----------------------------------+");
        logs.push("|  Code  | Latest |                 Name              |");
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`| ${chalk["yellow"](elem.code)} | ${chalk["yellow"](elem.latest)} | ${chalk["yellow"](elem.name)}`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push("|        |   Day  |   AVG  |   MIN  |   MAX  |  Rate  |");
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   01   |     5  | ${chalk[c_avg005](elem.avg005)} | ${chalk[c_min005](elem.min005)} | ${chalk[c_max005](elem.max005)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   02   |    10  | ${chalk[c_avg010](elem.avg010)} | ${chalk[c_min010](elem.min010)} | ${chalk[c_max010](elem.max010)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   03   |    15  | ${chalk[c_avg015](elem.avg015)} | ${chalk[c_min015](elem.min015)} | ${chalk[c_max015](elem.max015)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   04   |    20  | ${chalk[c_avg020](elem.avg020)} | ${chalk[c_min020](elem.min020)} | ${chalk[c_max020](elem.max020)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   05   |    25  | ${chalk[c_avg025](elem.avg025)} | ${chalk[c_min025](elem.min025)} | ${chalk[c_max025](elem.max025)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   06   |    30  | ${chalk[c_avg030](elem.avg030)} | ${chalk[c_min030](elem.min030)} | ${chalk[c_max030](elem.max030)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   07   |    60  | ${chalk[c_avg060](elem.avg060)} | ${chalk[c_min060](elem.min060)} | ${chalk[c_max060](elem.max060)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   08   |    90  | ${chalk[c_avg090](elem.avg090)} | ${chalk[c_min090](elem.min090)} | ${chalk[c_max090](elem.max090)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   09   |   120  | ${chalk[c_avg120](elem.avg120)} | ${chalk[c_min120](elem.min120)} | ${chalk[c_max120](elem.max120)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   10   |   150  | ${chalk[c_avg150](elem.avg150)} | ${chalk[c_min150](elem.min150)} | ${chalk[c_max150](elem.max150)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   11   |   180  | ${chalk[c_avg180](elem.avg180)} | ${chalk[c_min180](elem.min180)} | ${chalk[c_max180](elem.max180)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   12   |   210  | ${chalk[c_avg210](elem.avg210)} | ${chalk[c_min210](elem.min210)} | ${chalk[c_max210](elem.max210)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   13   |   240  | ${chalk[c_avg240](elem.avg240)} | ${chalk[c_min240](elem.min240)} | ${chalk[c_max240](elem.max240)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push(`|   14   |   270  | ${chalk[c_avg270](elem.avg270)} | ${chalk[c_min270](elem.min270)} | ${chalk[c_max270](elem.max270)} |   --   |`);
        logs.push("+--------+--------+-----------------------------------+");
        logs.push("");
    }

    return {
        "err" : false,
        "res" : logs,
    };
};

module.exports = fn_get_focus_main_info;
