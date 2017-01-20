import Nightmare from "nightmare"
import co from "co"
import fs from "fs-extra"
import {log} from "./util.js"
const options = require("../package.json").sitecheck
var stringify = require('csv-stringify');
var generate = require('csv-generate');
co(function*() {
        var headers = ["id", "url", "title", "description", "tel&fax", "tel link"];
        var data = [];
        data.push(headers)
        for (var i = 0; options.urls.length > i; i++) {
            var url = options.urls[i];
            var nightmare = Nightmare({show: false, width: 1920, height: 800})
            var _data = []
            _data.push(i)
            _data.push(url)
            // タイトルタグ

            yield nightmare.goto(url)
                .evaluate((selector) => {
                    return document.querySelector(selector).innerText
                }, "title")
                .then((text) => {
                    _data.push(text)
                    log(text, "タイトル", url);
                })
                .catch((err) => {
                    _data.push("title タグが設定されていません")
                    log("title タグが設定されていません", "err", url);
                })

            // meta[name="description"]
            yield nightmare.goto(url)
                .evaluate((selector) => {
                    return document.querySelector(selector).getAttribute("content")
                }, "meta[name='description']")
                .then((text) => {
                    _data.push(text)
                    log(text, "説明文", url);
                })
                .catch((err) => {
                    _data.push("not set")
                    log("meta description が設定されていません", "err", url);
                })

            // 電話番号チェック
            yield nightmare.goto(url)
                .evaluate((selector) => {
                    return document.querySelector(selector).innerText;
                }, "*")
                .then((text) => {
                    var tel = text.match(/0\d{1,2}-\d{3,4}-\d{4}/g)
                    _data.push(tel.join("、"))
                    log(tel, "電話番号文字列", url);
                })
                .catch((err) => {
                    _data.push("not set")
                    log("電話番号が見つかりませんでした", "err", url);
                })

            // 電話番号リンクチェック
            yield nightmare.goto(url)
                .evaluate((selector) => {
                    var lists = []
                    document.querySelectorAll(selector).forEach(function (data) {
                        lists.push(data.getAttribute("href"))
                    })
                    return lists;
                }, "a[href*='tel:']")
                .then((text) => {
                    _data.push(text.join("、"))
                    log(text, "電話番号リンク", url);
                })
                .catch((err) => {
                    _data.push("not set")
                    log("電話番号リンクが見つかりませんでした", "err", url);
                })

            data.push(_data)
            yield nightmare.end();

        }

        var lineArray = [];
        data.forEach(function (infoArray, index) {
            var line = infoArray.join(",");
            lineArray.push(line);
        });

        var csvContent = lineArray.join("\n");
        fs.outputFile(__dirname + "/sitecheck_results.csv", csvContent, function (err,data) {
            if ( err) {
                console.log(err);
            }
            log("tests/sitecheck_results.csv へエクスポートしました")
        })

    }
)

