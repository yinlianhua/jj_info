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


    let date = moment().format('YYYY-MM-DD');

    await sync_fund_list();
    await sync_fund_net();
    await sync_fund_main(date);

    /*
    let dates = [
        "2025-03-26",
        "2025-03-25",
        "2025-03-24",
        "2025-03-21",
        "2025-03-20",
        "2025-03-19",
        "2025-03-18",
        "2025-03-17",
        "2025-03-14",
        "2025-03-13",
        "2025-03-12",
        "2025-03-11",
        "2025-03-10",
        "2025-03-07",
        "2025-03-06",
        "2025-03-05",
        "2025-03-04",
        "2025-03-03",
        "2025-02-28",
        "2025-02-27",
        "2025-02-26",
        "2025-02-25",
        "2025-02-24",
        "2025-02-21",
        "2025-02-20",
        "2025-02-19",
        "2025-02-18",
        "2025-02-17",
        "2025-02-14",
        "2025-02-13",
        "2025-02-12",
        "2025-02-11",
        "2025-02-10",
        "2025-01-27",
        "2025-01-24",
        "2025-01-23",
        "2025-01-22",
        "2025-01-21",
        "2025-01-20",
        "2025-01-17",
        "2025-01-16",
        "2025-01-15",
        "2025-01-14",
        "2025-01-13",
        "2025-01-10",
        "2025-01-09",
        "2025-01-08",
        "2025-01-07",
        "2025-01-06",
        "2025-01-03",
        "2025-01-02"
    ];

    for (let date of dates.reverse()) {
        console.log(date)
        await sync_fund_main(date);
    }
    */

	process.exit(0)
})()
