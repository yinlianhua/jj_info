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

            // 获取分析查询配置信息
            var { err, res } = await self.fn_get_config(["fund_analyze_task", "fund_type"]);

            if (err) {
                console.log("Error, %s task exec failed !", self.input.task);

                return;
            }

            res = _.groupBy(res, "config_type");

            let fn_list   = _.groupBy(res["fund_analyze_task"], "key");
            let fund_type = _.groupBy(res["fund_type"], "key");

            taskloop: for (let k in fn_list) {
                var { err, res } = await this[fn_list[k][0]["value"]](fund_type[k][0]["value"]);

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
