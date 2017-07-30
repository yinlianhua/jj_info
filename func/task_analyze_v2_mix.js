/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let mysql  = require(BASIC_PATH + "/core/mysql");
let http   = require(BASIC_PATH + "/core/http");

// 混合型-分析
const task_analyze_v2_mix = async (type) => {
    let self = this;

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    //let today = moment().format("YYYY-MM-DD");
    let today = "2017-07-29";

    let date_list = [
        moment(today).subtract(90, "days").format("YYYY-MM-DD"),
        moment(today).subtract(60, "days").format("YYYY-MM-DD"),
        moment(today).subtract(30, "days").format("YYYY-MM-DD")
    ];

    let err_mark = false;

    // 清理数据
    var { err } = await _fund_data.where({ "fund_type" : type}).delete("fund_analyze");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} analyze failed !`
        };
    }

    outloop: for (let i=0; i<date_list.length; i++) {
        // 1.获取混合型code list
        var { err, res } = await _fund_data
            .select("code, name, change_type, sum(count) as count, sum(total_rate) as rate, sum(total_value) as value")
            .where({ "fund_type" : type, "change_type" : ["++", "--"] })
            .where(`start_date >= '${date_list[i]}'`)
            .where(`start_date < '${today}'`)
            .group_by("code, change_type")
            .order_by("code asc")
            .get("fund_rate_change");

        if (err) {
            err_mark = true;

            break outloop;
        }

        let list = _.groupBy(res.retObject.results, "code");

        let analyze_list = [];

        for (let k in list) {
            let data = {
                "fund_type" : type,
                "code"      : k
            };

            _.each(list[k], (elem) => {
                if(elem.rate > 0) {
                    data.name       = elem.name;
                    data.start_date = date_list[i];
                    data.up_rate    = elem.rate;
                    data.up_count   = elem.count;
                    data.up_value   = elem.value;
                } else{
                    data.name       = elem.name;
                    data.start_date = date_list[i];
                    data.down_rate  = elem.rate;
                    data.down_count = elem.count;
                    data.down_value = elem.value;
                }
            });

            analyze_list.push(data);
        }

        // 5.插入数据
        var { err } = await _fund_data.insert("fund_analyze", analyze_list);

        if (err) {
            err_mark = true;

            break outloop;
        }

    }

    return {
        "err" : err_mark,
        "res" : `${type} analyze ${err_mark == true ? "failed" : "success"} !`
    }
};

module.exports = task_analyze_v2_mix;
