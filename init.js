/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let moment = require('moment');

const init = () => {
    // Api Config
    let _config = require('./config');

    // global date
    global.TODAY = moment().format("YYYY-MM-DD");
    //global.TODAY = "2017-06-25";

    // global Api Basic Params
    global.BASIC_PATH = __dirname;
    global.TASK_PORT  = _config.port;
    global.TASK_ENV  = process.env.NODE_ENV == 'production' ? 'production' : 'development';

    // global Api Project Params
    global.TASK_NAME           = _config.name;
    global.TASK_VERSION        = _config.version;
    global.TASK_REQUIRE_PARAMS = _config.require_params;

    global.MYSQL = _config.mysql;

    global.TASK_COUNT = 0;
};

module.exports = init;
