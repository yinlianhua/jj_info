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

            // 获取基金预测配置信息
            var { err, res } = await self.fn_get_config(["fund_amount_calculate_task"]);

            if (err) {
                console.log("Error, %s task exec failed !", self.input.task);

                return;
            }

            taskloop: for (let k in res) {
                var { err, res } = await this[res[k]["value"]]("");

                if (err) {
                    console.log("Error, Task %s.%s exec failed !", self.input.task, res[k]["value"])

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
