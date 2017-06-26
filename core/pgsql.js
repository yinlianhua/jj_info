/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let PostgerSQL = require('./pgsql_active_record');

//初始化数据库连接
global.PGSQL_POOLS = {};

exports.getConn = function(dbName) {
    if (global.PGSQL_POOLS[dbName] != undefined) {
        return global.PGSQL_POOLS[dbName];
    } else {
        //初始化数据库连接
        for (let server in global.PGSQL) {

            let conf = global.PGSQL[server];

            global.PGSQL_POOLS[server] = new PostgerSQL(conf);
        }

        return global.PGSQL_POOLS[dbName];
    }
};
