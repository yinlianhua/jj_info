/**
 * Date : 2025-03-22
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

(async () => {
    // 获取基金主要信息
    let fn_get_focus_main_info = require("./func/fn_get_focus_main_info");

    await fn_get_focus_main_info();

	process.exit(0)
})()
