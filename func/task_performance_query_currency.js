/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let mysql  = require(BASIC_PATH + "/core/mysql");

// 本季度-实际消费完成额
const fn_cal_in_consume_real = async (task_id, bu, manager) => {
    let self = this;

    // DB Conn
    let _uanalyze_db   = mysql.getConn('uanalyze_slave');
    let _commission_db = mysql.getConn('commission_master');

    let condition = "sum(c_actual + c_add + c_return) as c_total";
    //let condition = "sum(c_actual + c_add + c_return + c_fix) as c_total";

    if (bu == 'TEU') {
        condition = "sum(c_actual + c_add + c_return + i_add) as c_total";
        //condition = "sum(c_actual + c_add + c_return + c_fix + i_add) as c_total";
    }

    // 获取数据
    var { res, err } = await _commission_db
        .select(condition)
        .where({
            "task_id" : task_id,
            "bu"      : bu,
            "manager" : manager
        })
        .get("quarter_consume_manager");

    if (err) {
        return {
            "err" : true,
            "res" : "cal in consume real failed !"
        };
    }

    let c_total = 0.00;

    if (res.retObject.results[0] != undefined && res.retObject.results[0]['c_total'] != null) {
        c_total = res.retObject.results[0]['c_total']
    }

    var { err } = await _commission_db
        .where({
            "task_id" : task_id,
            "bu"      : bu,
            "manager" : manager
        })
        .update("quarter_consume_manager", {
            "c_total" : c_total
        });

    if (err) {
        return {
            "err" : true,
            "res" : "cal in consume real failed !"
        };
    }

    return {
        "err" : false,
        "res" : "cal in consume real success !"
    }
};

module.exports = fn_cal_in_consume_real;