/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let sleep  = require('./core/sleep');

(async () => {
    let sync_fund_list = require("./sync_fund_list");
    let sync_fund_net  = require("./sync_fund_net");
    let sync_fund_main = require("./sync_fund_main");

    await sync_fund_list();
    await sync_fund_net();
    await sync_fund_main();

	process.exit(0)
})()
