/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let http   = require("../core/http");
let config = require("../config.json");

// 获取最新基金列表
const fn_get_latest_fund_list = async () => {
    let data = await http(config.url.fund_list, {}, false, 30000);

    if (data.err) {
        return {
            "err" : true,
            "res" : data.res,
        }
    }

    data = data.res.toString();
    data = data.replace("var r = [[", "");
    data = data.replace("]];", "");
    data = data.split("],[");

    let fund_list = [];

    for (let str of data) {
        let vals = str.split(",");

        let info = {
            "code"      : vals[0].replace(/"/g, ""),
            "name"      : vals[2].replace(/"/g, ""),
            "type"      : vals[3].replace(/"/g, "").split("-"),
            "main_type" : "",
            "sub_type"  : "",
            "focus"     : 0,
            "state"     : 0,
        }

        if (info.code == 1) {
            info.code = "000001";
        }

        if (info.type.length == 0) {
            info.type.push("其它");
            info.type.push("其它");
        }

        if (info.type.length == 0) {
            info.type.push("其它");
        }

        info.main_type = info.type[0] || "其它";
        info.sub_type  = info.type[1] || "其它";

        fund_list.push(info);
    }

    return {
        "err" : false,
        "res" : fund_list,
    };
};

module.exports = fn_get_latest_fund_list;
