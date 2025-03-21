/**
 * Date : 2025-03-21
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const fn_sleep = async (time) => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

module.exports = fn_sleep;
