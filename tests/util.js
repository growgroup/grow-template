import chalk from "chalk"
import fs from "fs-extra"
import util from 'util'
const pages = require("../package.json").screenshots;

/**
 * ログを出力
 */
export const log = function(text,device,url) {
    let log = chalk.blue.bold('[Screenshot] ');
    if ( typeof device !== "undefined" ){
        log += chalk.red.bold(" (" + device.toUpperCase() + ") ");
    }
    if ( typeof url !== "undefined" ){
        log += chalk.green.bold(" " + url + " ");
    }
    log += " " + text;
    console.log( log )
}

/**
 * ディレクトリを作成
 */
export const makeDirectory = function (callback) {
    for( var device in pages.viewports) {
        fs.ensureDir(__dirname + "/" + pages.screenshotPath + "/" + device, function (err) {
            if (err) {
                console.log(err)
                return false;
            }
        });
    }
    callback();
}

// ディレクトリをキレイに
export const cleanDirectroy = function (callback) {
    fs.remove(__dirname + "/" +pages.screenshotPath, function () {
        log("ディレクトリを清掃...")
        makeDirectory(callback);
    })
}
