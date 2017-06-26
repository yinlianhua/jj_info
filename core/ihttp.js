/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _           = require("underscore");
let request     = require("request");
let querystring = require("querystring");

const keySort = (params) => {
    let keys = _.keys(params);

    let params_sort = {};

    keys.sort();

    _.each(keys, (key) => {
        params_sort[key] = params[key];
    });

    return params_sort;
}

const sha1 = (str) => {
    let crypto = require("crypto").createHash("sha1");

    return crypto.update(str, 'utf8').digest('hex');
}

const verfyAC = (params, private_key) => {
    let params_data = "";

    delete params['Signature'];

    params = keySort(params);

    for (let key in params) {
        params_data += key;
        params_data += params[key];
    }

    params["Signature"] = sha1(params_data + private_key);

    return params;
}

const get = (uri, timeout) => {
    return new Promise((resolve, reject) => {
        request({
            uri     : uri,
            method  : "GET",
            timeout : timeout || 8000
        }, function(error, response, body) {
            if (error) {
                resolve({
                    "res" : error,
                    "err" : true
                });
            } else {
                resolve({
                    "res" : JSON.parse(body),
                    "err" : null
                });
            }
        });
    });
};

const post = (uri, data, timeout) => {
    return new Promise((resolve, reject) => {
        request({
            uri     : uri,
            method  : "POST",
            json    : true,
            body    : data,
            timeout : timeout || 8000
        }, function(error, response, body) {
            if (error) {
                resolve({
                    "res" : error,
                    "err" : true
                });
            } else {
                resolve({
                    "res" : body,
                    "err" : null
                });
            }
        });
    });
};

module.exports = async (params, use_post, timeout) => {
    let url = global.INNER_API.url;

    let _params = verfyAC(_.extend({}, params, { PublicKey : global.INNER_API.public_key }), global.INNER_API.private_key);

    if (!use_post) {
        url += ("/?" + querystring.stringify(_params));
    }

    return use_post ? await post(url, _params, timeout) : await get(url, timeout);
};