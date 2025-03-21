/**
 * Date : 2025-03-21
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const sqlite3 = require('sqlite3').verbose();

class SQLite3 {
    constructor () {
        this._client = null;
    }

    connect (db_path, db_mode="") {
        if (db_mode == "") {
            db_mode = sqlite3.OPEN_READWRITE;
        }

        let self = this;

        return new Promise((resolve, reject) => {
            self._client = new sqlite3.Database(db_path, db_mode, (err) => {
                if (err) {
                    self._client = null;
                    resolve({
                        err : true,
                        res : `SQLite3 Connect Failed! ${err.message}`,
                    });
                } else {
                    resolve({
                        err : false,
                        res : `SQLite3 Connect Success!`,
                    });
                }
            })
        });
    }

    // db.run('CREATE TABLE user(name text)', function (err) { })
    // db.run('INSERT INTO user(name) VALUES(?)', ['Alice'], function (err) { })
    // db.run( 'UPDATE user SET name = ? WHERE name = ?', ['Alin', 'Alice'], function (err) { })
    // db.run('DELETE FROM user WHERE name = ?', ['Alin'], })
    // db.all('SELECT name FROM user WHERE name = ?', ['Alice'], function (err, rows) { })
    // db.all('SELECT * FROM user', [], function (err, rows) { })

    // 查询
    get () {
        let self = this;
        let args = [].slice.call(arguments);

        return new Promise((resolve, reject) => {
            args.push((err, rows) => {
                if (err) {
                    resolve({
                        err : true,
                        res : err.message,
                    });
                } else {
                    resolve({
                        err : false,
                        res : rows,
                    })
                }
            });

            self._client.all(...args);
        });
    }

    // 增删改
    set () {
        let self = this;
        let args = [].slice.call(arguments);

        return new Promise((resolve, reject) => {
            args.push((err) => {
                if (err) {
                    resolve({
                        err : true,
                        res : err.message,
                    });
                } else {
                    resolve({
                        err : false,
                        res : "Success",
                    })
                }
            });

            self._client.run(...args);
        });
    }

    close() {
        let self = this;

        return new Promise((resolve, reject) => {
            self._client.close((err) => {
                self._client = null;

                if (err) {
                    resolve({
                        err : true,
                        res : err.message,
                    });
                } else {
                    resolve({
                        err : false,
                        res : "Success",
                    })
                }
            })
        });
    }
}

module.exports = new SQLite3();
