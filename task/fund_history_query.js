/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _         = require('underscore');
let moment    = require('moment');
let task_core = require(BASIC_PATH + "/core/task_core");

module.exports = task_core({
    // 主处理函数
    async run () {
        try {
            let self = this;

            // 获取净值查询配置信息
            var { err, res } = await self.fn_get_config(["fund_net_worth_task", "fund_net_worth_prop", "fund_net_worth_url", "fund_type"]);

            if (err) {
                console.log("Error, %s task exec failed !", self.input.task);

                return;
            }

            res = _.groupBy(res, "config_type");

            let fn_list    = _.groupBy(res["fund_net_worth_task"], "key");
            let fund_type  = _.groupBy(res["fund_type"], "key");
            let task_url   = _.groupBy(res['fund_net_worth_url'], "key");
            let task_props = _.pluck(_.indexBy(res["fund_net_worth_prop"], "key"), "value");

            taskloop: for (let k in fn_list) {
                let start_date = "2016-01-01";
                let day_count  = 0;

                if (k == 1) {
                    while (moment(start_date).add(day_count, "day").format("YYYY-MM-DD") != "2017-06-23") {
                        let url = `http://stock.finance.qq.com/cgi-bin/fund/jzzx_d?fm=js&d=${moment(start_date).add(day_count, "day").format("YYYYMMDD")}&t=1`;

                        global.TODAY = moment(start_date).add(day_count, "day").format("YYYY-MM-DD");

                        let { err } = await this[fn_list[k][0]["value"]](url, fund_type[k][0]["value"], task_props);

                        if (err) {
                            console.log("Error, Task %s.%s exec failed !", self.input.task, fn_list[k][0]["value"])

                            break taskloop;
                        }

                        day_count++;
                    }
                }

                if (k == 2) {
                    while (moment(start_date).add(day_count, "day").format("YYYY-MM-DD") != "2017-06-23") {
                        let url = `http://stock.finance.qq.com/cgi-bin/fund/jzzx_d?fm=js&d=${moment(start_date).add(day_count, "day").format("YYYYMMDD")}&t=2`;

                        global.TODAY = moment(start_date).add(day_count, "day").format("YYYY-MM-DD");

                        let { err } = await this[fn_list[k][0]["value"]](url, fund_type[k][0]["value"], task_props);

                        if (err) {
                            console.log("Error, Task %s.%s exec failed !", self.input.task, fn_list[k][0]["value"])

                            break taskloop;
                        }

                        day_count++;
                    }
                }

                if (k == 3) {
                    while (moment(start_date).add(day_count, "day").format("YYYY-MM-DD") != "2017-06-23") {
                        let url = `http://stock.finance.qq.com/cgi-bin/fund/jzzx_d?fm=js&d=${moment(start_date).add(day_count, "day").format("YYYYMMDD")}&t=3`;

                        global.TODAY = moment(start_date).add(day_count, "day").format("YYYY-MM-DD");

                        let { err } = await this[fn_list[k][0]["value"]](url, fund_type[k][0]["value"], task_props);

                        if (err) {
                            console.log("Error, Task %s.%s exec failed !", self.input.task, fn_list[k][0]["value"])

                            break taskloop;
                        }

                        day_count++;
                    }
                }


                /*
                var { err, res } = await this[fn_list[k][0]["value"]](task_url[k][0]["value"], fund_type[k][0]["value"], task_props);

                if (err) {
                    console.log("Error, Task %s.%s exec failed !", self.input.task, fn_list[k][0]["value"])

                    break taskloop;
                } else {
                    console.log(res);
                }
                */
            }
        
        } catch (e) {
            console.log(e);
            console.log(e.stack);

            process.exit(-1);
        }
    }
});