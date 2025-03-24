/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let mysql  = require(BASIC_PATH + "/core/mysql");
let http   = require(BASIC_PATH + "/core/http");

// 股票型-变化率统计
const task_rate_change_stock = async (type) => {
    let self = this;

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    // 1.获取股票型code list
    var { err, res } = await _fund_data
        .select("distinct code")
        .where({ "type" : type })
        .order_by("code asc")
        .get("fund_net_worth");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} rate change count failed !`
        };
    }

    let err_mark = false;

    let code_list = _.pluck(res.retObject.results, "code");

    loop: for(let i=0; i<code_list.length; i++) {
        let code = code_list[i];

        // 2.查询相关记录
        var { err, res } = await _fund_data
            .where({ "code" : code_list[i] })
            .group_by("date")
            .order_by("date asc")
            .get("fund_net_worth");

        if (err) {
            err_mark = true;

            break loop;
        }

        // 3.循环处理
        let count       = 0;
        let total_rate  = 0;
        let total_price = 0;
        let date        = "";

        let this_type   = "";
        let last_type   = "";

        let change_list = [];

        res = res.retObject.results;

        for(let j=0; j < res.length; j++) {
            let info = res[j];

            if (info.change_rate > 0) {
                this_type = "++";
            }

            if (info.change_rate < 0) {
                this_type = "--";
            }

            if (info.change_rate == 0) {
                this_type = "==";
            }

            if (last_type == "") {
                last_type = this_type;
            }

            if (this_type != last_type) {
                change_list.push({
                    "code"        : info.code,
                    "name"        : info.name,
                    "start_date"  : res[j-count]['date'],
                    "end_date"    : res[j-1]['date'],
                    "fund_type"   : type,
                    "change_type" : last_type,
                    "count"       : count,
                    "total_rate"  : total_rate.toFixed(4),
                    "total_value" : total_price.toFixed(4)
                });

                count       = 0;
                total_rate  = 0;
                total_price = 0;
                date        = "";
            }

            last_type    = this_type;
            count       += 1;
            total_rate  += info.change_rate;
            total_price += info.change_price;

            if (j == res.length - 1) {
                change_list.push({
                    "code"        : info.code,
                    "name"        : info.name,
                    "start_date"  : res[j-count + 1]['date'],
                    "end_date"    : info.date,
                    "fund_type"   : type,
                    "change_type" : last_type,
                    "count"       : count,
                    "total_rate"  : total_rate.toFixed(4),
                    "total_value" : total_price.toFixed(4)
                });
            }
        }

        // 4.清理数据
        var { err } = await _fund_data.where({"code" : code}).delete("fund_rate_change");

        if (err) {
            err_mark = true;

            break loop;
        }

        // 5.插入数据
        var { err } = await _fund_data.insert("fund_rate_change", change_list);

        if (err) {
            err_mark = true;

            break loop;
        }
    }

    return {
        "err" : err_mark,
        "res" : `${type} rate change count ${err_mark == true ? "failed" : "success"} !`
    }
};

module.exports = task_rate_change_stock;