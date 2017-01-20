import Nightmare from "nightmare"
import co from "co"
import {log} from "./util.js"
const options = require("../package.json").sitecheck

co(function*() {

        for (var i = 0; options.urls.length > i; i++) {
            var url = options.urls[i];

            var nightmare = Nightmare({show: false, width: 1920, height: 800})
            // タイトルタグ
            yield nightmare.goto(url)
                .evaluate((selector) => {
                    return document.querySelector(selector).innerText
                }, "title")
                .then((text) => {
                    log(text, "タイトル", url);
                })
                .catch((err)=>{
                    log("title タグが設定されていません", "err", url);
                })

            // meta[name="description"]
            yield nightmare.goto(url)
                .evaluate((selector) => {
                    return document.querySelector(selector).getAttribute("content")
                }, "meta[name='description']")
                .then((text) => {
                    log(text, "説明文", url);
                })
                .catch((err)=>{
                    log("meta description が設定されていません", "err", url);
                })

            // 電話番号チェック
            yield nightmare.goto(url)
                .evaluate((selector) => {
                    return document.querySelector(selector).innerText;
                }, "*")
                .then((text) => {
                    var tel = text.match(/0\d{1,2}-\d{3,4}-\d{4}/g)
                    log(tel, "電話番号文字列", url);
                })
                .catch((err)=>{
                    log("電話番号が見つかりませんでした", "err", url);
                })

            // 電話番号リンクチェック
            yield nightmare.goto(url)
                .evaluate((selector) => {
                    var lists = []
                    document.querySelectorAll(selector).forEach(function(data){
                        lists.push(data.getAttribute("href"))
                    })
                    return lists;
                }, "a[href*='tel:']")
                .then((text) => {
                    log(text, "電話番号リンク", url);
                })
                .catch((err)=>{
                    log("電話番号リンクが見つかりませんでした", "err", url);
                })



            yield nightmare.end();

        }
    }
)

