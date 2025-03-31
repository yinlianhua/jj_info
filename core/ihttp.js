/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let request     = require("request");
let querystring = require("querystring");

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

const hget = (uri, timeout, header) => {
    return new Promise((resolve, reject) => {
        request({
            uri     : uri,
            method  : "GET",
            timeout : timeout || 8000,
            headers : header
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

const hpost = (uri, data, timeout, header) => {
    return new Promise((resolve, reject) => {
        request({
            uri     : uri,
            method  : "POST",
            json    : true,
            body    : data,
            timeout : timeout || 8000,
            headers : header
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

module.exports = async (url, params, use_post, timeout=60000, header=false) => {
    if (!use_post) {
        url += ("/?" + querystring.stringify(params));
    }

    if (header == false) {
        return use_post ? await post(url, params, timeout) : await get(url, timeout);
    }

    return use_post ? await hpost(url, params, timeout, header) : await hget(url, timeout, header);
};
