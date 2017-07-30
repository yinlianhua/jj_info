/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let mysql  = require(BASIC_PATH + "/core/mysql");
let http   = require(BASIC_PATH + "/core/http");

// 混合型-预测
const task_forecast_v2_mix = async (type) => {
    let self = this;

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    //let today      = moment().format("YYYY-MM-DD");
    let today = "2017-07-29";

    // 1.获取股票型code list
    var { err, res } = await _fund_data
        .select("fund_type, code, name, up_rate, down_rate, sum(up_count - down_count) as count, sum(up_value + down_value) as value, start_date")
        .where({ "fund_type" : type })
        .group_by("code, start_date")
        .order_by("code, start_date asc")
        .get("fund_analyze");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} forecast failed !`
        };
    }

    let list = _.groupBy(res.retObject.results, "code");

    let err_mark = false;

    let forecast_list = [];

    // 2.循环计算
    for (let k in list) {

        let profit_1 = 0;
        let profit_2 = 0;
        let profit_3 = 0;

        if (list[k].length == 3) {
            profit_1 = (list[k][0]['up_rate'] + (list[k][0]['down_rate'] * 2)) * 0.1;
            profit_2 = (list[k][1]['up_rate'] + (list[k][1]['down_rate'] * 2)) * 0.3;
            profit_3 = (list[k][2]['up_rate'] + (list[k][2]['down_rate'] * 2) )* 0.6;
        }

        if (list[k].length == 2) {
            profit_1 = (list[k][0]['up_rate'] + (list[k][0]['down_rate'] * 2)) * 0.4;
            profit_2 = (list[k][1]['up_rate'] + (list[k][1]['down_rate'] * 2)) * 0.6;
        }

        if (list[k].length == 1) {
            profit_1 = list[k][0]['up_rate'] + (list[k][0]['down_rate'] * 2);
        }

        let avg_rate = profit_1 + profit_2 + profit_3;

        let expect = "";

        if (avg_rate > 0 && avg_rate < 3) {
            expect = "+";
        }

        if (avg_rate >= 3 && avg_rate < 6) {
            expect = "++";
        }

        if (avg_rate >= 6 && avg_rate < 12) {
            expect = "+++";
        }

        if (avg_rate >= 12 && avg_rate < 18) {
            expect = "++++";
        }

        if (avg_rate >= 18) {
            expect = "+++++";
        }

        if (avg_rate <= 0 && avg_rate > -3) {
            expect = "-";
        }

        if (avg_rate <= -3 && avg_rate > -6) {
            expect = "--";
        }

        if (avg_rate <= -6 && avg_rate > -12) {
            expect = "---";
        }

        if (avg_rate <= -12 && avg_rate > -18) {
            expect = "----";
        }

        if (avg_rate <= -18) {
            expect = "-----";
        }

        forecast_list.push({
            "type"      : type,
            "code"      : k,
            "name"      : list[k][0]['name'],
            "profit"    : avg_rate,
            "float"     : 0.00,
            "total_low" : 0.00,
            "total_up"  : 0.00,
            "expect"    : expect,
            "date"      : today
        });
    }

    // 3.删除当天数据
    var { err } = await _fund_data.where({ "date" : today, "type" : type }).delete("fund_forecast");

    if (err) {
        err_mark = true;
    }

    // 4.插入数据
    var { err } = await _fund_data.insert("fund_forecast", forecast_list);

    if (err) {
        err_mark = true;
    }

    return {
        "err" : err_mark,
        "res" : `${type} forecast ${err_mark == true ? "failed" : "success"} !`
    }
};

module.exports = task_forecast_v2_mix;
