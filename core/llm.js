/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let http   = require("./ihttp");
let config = require("../secret.json");

const llm = async (prompts=[], json_output=true, temperature=0.85, model="deepseek-chat") => {
    let header = {
        "Authorization" : "Bearer " + config.llm.key,
    }

    let params = {
        "model"       : model || config.llm.model,
        "messages"    : prompts,
        "temperature" : temperature || 0.85,
        "stream"      : false,
    }

    if (json_output == true) {
        params.response_format = {
            "type" : "json_object"
        }
    }

    let res = await http(config.llm.url, params, true, 120000, header);

    if (res.err) {
        return {
            "err" : true,
            "res" : `LLM 请求失败 ${JSON.stringify(res.res)}`
        }
    }

    return {
        "err" : false,
        "res" : {
            "usage" : res.res.usage,
            "data"  : res.res.choices,
        }
    }
};

module.exports = llm;
