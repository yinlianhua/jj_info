/**
 * Date : 2017-06-09
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const nodemailer    = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const config        = require("../secret.json");

// SMTP Transport
let transporter = nodemailer.createTransport(smtpTransport(config.smtp));

const mail = async (options) => {
    options.from = config.smtp.auth.user;

    return await new Promise((resolve, reject) => {
        transporter.sendMail(options, (error) => {
            if (error) {
                resolve({
                    err : true,
                    res : error
                });
            } else {
                resolve({
                    err : null,
                    res : "mail send success !"
                });
            }
        });
    });
};

module.exports = mail;
