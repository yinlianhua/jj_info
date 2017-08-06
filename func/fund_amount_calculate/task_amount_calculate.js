/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let mysql  = require(BASIC_PATH + "/core/mysql");
let http   = require(BASIC_PATH + "/core/http");

// 基金价值计算
const task_amount_calculate = async (type) => {
    let self = this;

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    let today = moment().subtract(1, "days").format("YYYY-MM-DD");

    let err_mark = false;

    // 获取持有基金数据
    var {err, res} = await _fund_data.where({"state" : "take"}).get("fund_focus");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} amount calculate failed !`
        };
    }

    let fund_list = res.retObject.results;

    outloop: for (let i in fund_list) {

        // 0.原始金额
        let amount = fund_list[i]['take_amount'];

        // 1.扣除购买手续费
        let buy_tax = amount * fund_list[i]['take_tax'];

        amount = +(amount - buy_tax).toFixed(2);

        // 2.查询购买时期单价
        var {err, res} = await _fund_data
            .where({
                "code" : fund_list[i]['code'],
                "date" : fund_list[i]['take_date']
            })
            .group_by("date")
            .get("fund_net_worth");

        if (err || res.retObject.results.length != 1) {
            err_mark = true;

            break outloop;
        }

        // 3.计算份数
        let count = amount / res.retObject.results[0]['unit_price'];

        // 4.查询当前单价
        var {err, res} = await _fund_data
            .where({
                "code"        : fund_list[i]['code'],
                "insert_date" : today
            })
            .group_by("date")
            .get("fund_net_worth");

        if (err || res.retObject.results.length != 1) {
            err_mark = true;

            break outloop;
        }

        // 5.计算当前总价
        amount = count * res.retObject.results[0]['unit_price'];

        // 6.扣除卖出手续费
        amount = +(amount * (1 - fund_list[i]['sale_tax'])).toFixed(2);

        // 6.计算最终收益率
        let profit_rate = ((amount / fund_list[i]["take_amount"]) - 1) * 100;

        // 7.更新数据
        var {err} = await _fund_data
            .where({
                code : fund_list[i]['code']
            })
            .update("fund_focus", {
                "date"           : today,
                "current_amount" : amount,
                "current_profit" : profit_rate
            })

        if (err) {
            err_mark = true;

            break outloop;
        }
    }

    return {
        "err" : err_mark,
        "res" : `${type} amount calculate ${err_mark == true ? "failed" : "success"} !`
    }
};

module.exports = task_amount_calculate;
