/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let iconv  = require('iconv-lite');
let mysql  = require(BASIC_PATH + "/core/mysql");
let http   = require(BASIC_PATH + "/core/http");

// 混合型-业绩查询
const task_performance_query_mix = async (url, type, props) => {
    let self = this;

    var { err, res } = await http(url, {}, true, 30000);

    if (err) {
        return {
            "err" : true,
            "res" : `${type} performance query failed !`
        };
    }

    // 数据处理
    res = iconv.decode(res, "GBK");

    let start = res.indexOf("[");
    let end   = res.lastIndexOf("]");

    res = res.slice(start, end+1)
        .replace(/{/g, '{"')
        .replace(/:/g, '":')
        .replace(/,/g, ',"')
        .replace(/"{/g, '{')
        .replace(/":00/g, ':00')
        .replace(/\n/g, '');

    res = JSON.parse(res);

    let performance_list = [];

    _.each(res, (elem) => {
        let obj = {
            "type"                : type,
            "code"                : elem.symbol,
            "name"                : elem.sname,
            "unit_price"          : elem.per_nav || 0.00,
            "total_price"         : elem.total_nav || 0.00,
            "quarter_rate"        : elem.three_month || 0.00,
            "half_year_rate"      : elem.six_month || 0.00,
            "year_rate"           : elem.one_year || 0.00,
            "from_year_rate"      : (elem.form_year - 100) || 0.00,
            "from_establish_rate" : elem.form_start || 0.00,
            "date"                : moment(elem.jzrq).format("YYYY-MM-DD"),
            "insert_date"         : global.TODAY
        };

        performance_list.push(obj);
    })

    performance_list = _.sortBy(performance_list, "code");

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    // 清理历史数据
    var { err } = await _fund_data
        .where({
            "type"        : type,
            "insert_date" : global.TODAY
        })
        .delete("fund_performance");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} performance query failed !`
        };
    }

    // 数据插入
    var { err } = await _fund_data
        .insert("fund_performance", performance_list);

    if (err) {
        return {
            "err" : true,
            "res" : `${type} performance query failed !`
        };
    }

    return {
        "err" : false,
        "res" : `${type} performance query success !`
    }
};

module.exports = task_performance_query_mix;