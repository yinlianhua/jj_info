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

            // 获取业绩查询配置信息
            var { err, res } = await self.fn_get_config(["fund_performance_task", "fund_performance_prop", "fund_performance_url", "fund_type"]);

            if (err) {
                console.log("Error, %s task exec failed !", self.input.task);

                return;
            }

            res = _.groupBy(res, "config_type");

            let fn_list    = _.groupBy(res["fund_performance_task"], "key");
            let fund_type  = _.groupBy(res["fund_type"], "key");
            let task_url   = _.groupBy(res['fund_performance_url'], "key");
            let task_props = _.pluck(_.indexBy(res["fund_performance_prop"], "key"), "value");

            taskloop: for (let k in fn_list) {
                var { err, res } = await this[fn_list[k][0]["value"]](task_url[k][0]["value"], fund_type[k][0]["value"], task_props);

                if (err) {
                    console.log("Error, Task %s.%s exec failed !", self.input.task, fn_list[k][0]["value"])

                    break taskloop;
                } else {
                    console.log(res);
                }
            }

        } catch (e) {
            console.log(e);
            console.log(e.stack);

            process.exit(-1);
        }
    }
});