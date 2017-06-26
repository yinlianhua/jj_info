/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let moment = require("moment");
let mysql  = require(BASIC_PATH + "/core/mysql");

// 获取配置信息
const fn_get_config = async (type) => {
    let self = this;

    // DB Conn
    let _fund_data = mysql.getConn('fund_data');

    // 查询配置信息
    let { res, err } = await _fund_data
        .where({ "config_type" : type, "status" : 1 })
        .get("fund_config");

    if (err) {
        return {
            "err" : true,
            "res" : []
        };
    }

    return {
        "err" : false,
        "res" : res.retObject.results
    };
};

module.exports = fn_get_config;