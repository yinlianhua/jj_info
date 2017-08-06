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

// 债券型-净值查询
const task_net_worth_query_bond = async (url, type, props) => {
    let self = this;

    var { err, res } = await http(url, {}, true, 30000);

    if (err) {
        return {
            "err" : true,
            "res" : `${type} net worth query failed !`
        };
    }

    // 数据处理
    res = iconv.decode(res, "GBK");

    let start = res.indexOf("[");
    let end   = res.lastIndexOf("]");

    res = JSON.parse(res.slice(start, end+1));

    let net_worth_list = [];

    _.each(res, (elem) => {
        let obj = _.object(props, elem.slice(0, props.length));

        obj.type = type

        obj.insert_date = global.TODAY;

        net_worth_list.push(obj);
    })

    net_worth_list = _.sortBy(net_worth_list, "code");

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    // 清理历史数据
    var { err } = await _fund_data
        .where({
            "type"        : type,
            "insert_date" : global.TODAY
        })
        .delete("fund_net_worth");

    if (err) {
        return {
            "err" : true,
            "res" : `${type} net worth query failed !`
        };
    }

    // 数据插入
    var { err } = await _fund_data
        .insert("fund_net_worth", net_worth_list);

    if (err) {
        return {
            "err" : true,
            "res" : `${type} net worth query failed !`
        };
    }

    return {
        "err" : false,
        "res" : `${type} net worth query success !`
    }
};

module.exports = task_net_worth_query_bond;