/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let mysql  = require(BASIC_PATH + "/core/mysql");
let http   = require(BASIC_PATH + "/core/http");

// 混合型-涨跌率分析
const task_recent_rate_mix = async (type) => {
    let self = this;

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    //let today = moment().format("YYYY-MM-DD");
    let today = "2017-08-04";

    let days = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84];

    let date_list = [];

    let recent_rate_list = [];

    _.each(days, (elem) => {
        date_list.push(moment(today).subtract(elem, 'days').format("YYYY-MM-DD"));
    });

    let err_mark = false;

    // 0.获取最新数据
    var {err, res} = await _fund_data
        .select("type, date, code, name, unit_price, insert_date")
        .where({"insert_date" : today, "type" : type})
        .order_by("code, date desc")
        .get("fund_net_worth");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} recent rate failed !`
        };
    }

    let latest_list = _.groupBy(res.retObject.results, "code");

    // 1.获取历史数据
    var {err, res} = await _fund_data
        .select("type, date, code, name, unit_price, insert_date")
        .where({"insert_date" : date_list, "type" : type})
        .order_by("code, date desc")
        .get("fund_net_worth");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} recent rate failed !`
        };
    }

    let recent_list = _.groupBy(res.retObject.results, "code");

    // 2.清理数据
    var { err } = await _fund_data
        .where({"fund_type" : type})
        .delete("fund_recent_rate");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} recent rate failed !`
        };
    }

    // 3.循环处理
    outloop: for (let i in latest_list) {
        let info_latest = latest_list[i][0];

        let info_recent = recent_list[info_latest.code];

        let data = {
            "date"       : today,
            "fund_type"  : type,
            "code"       : info_latest.code,
            "name"       : info_latest.name,
            "rate_1w"    : 0,
            "rate_2w"    : 0,
            "rate_3w"    : 0,
            "rate_4w"    : 0,
            "rate_5w"    : 0,
            "rate_6w"    : 0,
            "rate_7w"    : 0,
            "rate_8w"    : 0,
            "rate_9w"    : 0,
            "rate_10w"   : 0,
            "rate_11w"   : 0,
            "rate_12w"   : 0
        }

        innerloop: for (let j in info_recent) {
            data[`rate_${+j+1}w`] = ((info_latest['unit_price'] / info_recent[j]['unit_price']) - 1) * 100;
        }

        recent_rate_list.push(data);

        if (recent_rate_list.length%100 == 0) {
            // 4.插入数据
            var { err } = await _fund_data.insert("fund_recent_rate", recent_rate_list);

            recent_rate_list = [];

            if (err) {
                err_mark = true;

                break outloop;
            }
        }
    }

    if (recent_rate_list.length != 0) {
        // 5.插入数据
        var { err } = await _fund_data.insert("fund_recent_rate", recent_rate_list);

        if (err) {
            err_mark = true;
        }
    }

    return {
        "err" : err_mark,
        "res" : `${type} recent rate ${err_mark == true ? "failed" : "success"} !`
    }
};

module.exports = task_recent_rate_mix;
