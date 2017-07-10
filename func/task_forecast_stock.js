/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let mysql  = require(BASIC_PATH + "/core/mysql");
let http   = require(BASIC_PATH + "/core/http");

// 股票型-预测
const task_forecast_stock = async (type) => {
    let self = this;

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    let start_date = moment().startOf("month").subtract(1, "year").format("YYYY-MM-DD");
    let end_date   = moment().startOf("month").format("YYYY-MM-DD");
    let today      = moment().format("YYYY-MM-DD");

    // 1.获取股票型code list
    var { err, res } = await _fund_data
        .select("fund_type, code, name, sum(up_rate + down_rate) as rate, sum(up_count - down_count) as count, sum(up_value + down_value) as value, start_date")
        .where({ "fund_type" : type })
        .where(`start_date >= '${start_date}' and start_date < '${end_date}'`)
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
        // 加权计算平均值
        let last_rate = list[k][list[k]['length'] - 1]['rate'] || 0.0000;

        let avg_list = _.sortBy(_.pluck(list[k], "rate"));
            avg_list = avg_list.slice(1, avg_list.length - 2);

        let avg_rate = _.reduce(avg_list, (memo, num) => { return memo + num; }, 0);
            avg_rate = avg_list.length > 0 ? (avg_rate/avg_list.length).toFixed(4) : 0.0000;

        let charge_rate = Math.abs(+avg_rate - +last_rate).toFixed(4);

        let profit_low = (+avg_rate - 2 * +charge_rate).toFixed(4);
        let profit_up  = (+avg_rate + +charge_rate).toFixed(4);

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
            "float"     : charge_rate,
            "total_low" : profit_low,
            "total_up"  : profit_up,
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

module.exports = task_forecast_stock;
