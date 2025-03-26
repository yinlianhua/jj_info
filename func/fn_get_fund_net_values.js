/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let http   = require("../core/http");
let sleep  = require('../core/sleep');
let config = require("../config.json");

// 获取最新基金净值
const fn_get_fund_net_values = async (code, name, start, end) => {
    let res = {
        "err" : false,
        "res" : [],
    }

    let start_date = start;
    let end_date   = moment(start_date).add(19, "day").format("YYYY-MM-DD");
    let res_data   = [];

    do {
        let url = `${config.url.fund_net}symbol=${code}&datefrom=${start_date}&dateto=${end_date}&page=1`;

        let data = await http(url, {}, false, 30000);

        data.res = JSON.parse(data.res.toString());

        if (data.err || data.res.result.status.code != 0) {
            res.err = true;
            res.res = data.res;
            break;
        }

        // console.log(start_date, "-", end_date, data.res.result.data.data.length);

        for (let elem of (data.res.result.data.data || []).reverse()) {
            res_data.push({
                "code" : code,
                "name" : name,
                "date" : moment(elem.fbrq).format("YYYY-MM-DD"),
                "jjjz" : elem.jjjz,
                "ljjz" : elem.ljjz,
            });
        }

        start_date = moment(end_date).add(1, "day").format("YYYY-MM-DD");
        end_date   = moment(start_date).add(19, "day").format("YYYY-MM-DD")

        await sleep(300);
    } while(start_date <= end);

    if (res.err) {
        return res;
    }

    return {
        "err" : false,
        "res" : res_data,
    }
};

module.exports = fn_get_fund_net_values;
