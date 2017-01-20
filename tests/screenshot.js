// スクリーンショットを一括で撮る
// package.json に設定を追記
import {cleanDirectroy, log} from "./util.js"
const Pageres = require("pageres")
const pages = require("../package.json").screenshots

class Screenshot {

    /**
     * 初期化
     */
    constructor(activekey) {
        log("スクリーンショットを開始します...");
        this.run = this.run.bind(this)
        this.shot = this.shot.bind(this)
        cleanDirectroy(this.run)
        this.activekey = activekey
    }

    /**
     * スクリーンショットを取る
     * @param url
     * @param device
     * @returns {boolean}
     */
    shot(url, device) {

        if (typeof pages.urls[this.activekey] === "undefined") {
            // log("すべて完了しました！...", device);
            return false;
        }

        if (typeof device === "undefined") {
            var device = "pc";
        }

        log("スクリーンショットを変換しています...", device, url);

        var viewports = pages.viewports

        var _name = url.replace(/\//g, "_");
        var _name = _name.replace(/\./g, "_");
        var _name = _name.replace(/http:/, "");
        var _name = _name.replace(/__/, "");

        let options = {
            delay: 1
        }
        options  = Object.assign(options,pages.pageres)
        const _pageres = new Pageres(options)
            .src(url, [viewports[device].width + 'x' + viewports[device].height])
            .dest(__dirname + '/screenshots/' + device + '/')
            .run()
            .then(() => {
                log("完了しました", device, url);
                this.activekey++
                this.run();
            });
    }

    /**
     * 実行
     */
    run() {

        for (var device in pages.viewports) {
            this.shot(pages.urls[this.activekey], device)
        }
    }

}

new Screenshot(0)
