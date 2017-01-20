import chalk from "chalk"
import fs from "fs-extra"
import util from 'util'
const pages = require("../package.json").checktools.pages;
const options = require("../package.json").checktools.screenshots;

/**
 * ログを出力
 */
export const log = function(text,device,url) {
    let log = chalk.blue.bold('[GG] ');

    if ( typeof url !== "undefined" && url !== false ){
        log += chalk.green.bold(" " + url + " ");
    }

    if ( typeof device !== "undefined" && device !== false ){
        log += chalk.red.bold(" (" + device.toUpperCase() + ") ");
    }

    log += " " + text;
    console.log( log )
}

/**
 * ディレクトリを作成
 */
export const makeDirectory = function (callback) {
    for( var device in options.viewports) {
        fs.ensureDir(__dirname + "/" + options.screenshotPath + "/" + device, function (err) {
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
    fs.remove(__dirname + "/" + options.screenshotPath, function () {
        log("ディレクトリを清掃...")
        makeDirectory(callback);
    })
}
