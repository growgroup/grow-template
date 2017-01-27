import request from "request"
import cheerio from 'cheerio'
import URL from 'url-parse';
var pages = require("../package.json").checktools.pages


class CrawlLinks {
    /**
     * コンストラクタ
     * @param start_url 基点となるURL
     * @param keyword キーワード
     */
    constructor(start_url, keyword) {
        // 基点となるURL
        this.start_url = start_url
        this.search_keyword = keyword

        this.max_pages_to_visit = 100
        this.pagesVisited = {}
        this.numPagesVisited = 0;
        this.pagesToVisit = [];
        this.url = new URL(this.start_url)
        this.baseUrl = this.url.protocol + "//" + this.url.hostname;
        this.listurls = []
        this.pagesToVisit.push(this.start_url);
        this.visitPage = this.visitPage.bind(this)
        this.crawl = this.crawl.bind(this)
        this.checkUrl = this.checkUrl.bind(this)
        this.crawl();
    }

    crawl() {
        if (this.numPagesVisited >= this.max_pages_to_visit) {
            console.log(this.listurls.join("\n"));
            console.log("Reached max limit of number of pages to visit.");
            return;
        }
        var nextPage = this.pagesToVisit.pop();

        if (typeof nextPage === "undefined") {
            console.log(this.listurls.join("\n"));
            return;
        }
        if (nextPage in this.pagesVisited) {
            this.crawl();
        } else {

            this.visitPage(nextPage, this.crawl);
        }
    }

    visitPage(url, callback) {
        this.pagesVisited[url] = true;
        this.numPagesVisited++;

        console.log("" + url);
        var self = this
        request(url, function (error, response, body) {

            if (response.statusCode !== 200) {
                callback();
                return;
            }

            var $ = cheerio.load(body);
            self.listurls.push({url: url, title: $("title").text()})
            if (self.search_keyword) {
                var isWordFound = self.searchForWord($, self.search_keyword);
                if (isWordFound) {
                    console.log('Word ' + self.search_keyword + ' found at page ' + url);
                } else {
                    self.collectInternalLinks($);
                    callback();
                }
            } else {
                self.collectInternalLinks($);
                callback();
            }

        });
    }

    /**
     *
     * @param url string
     */
    checkUrl(url) {
        var _url = this.url.hostname.replace(/[\-|\.|\_]/g, function (match) {
            return "\\" + match;
        })
        var reg = new RegExp("^https?:\/\/" + _url + ".*?[^?].*", "g")

        var match = url.match(reg)

        return ! ( match == null )
    }

    collectInternalLinks($) {
        var relativeLinks = $("a[href^='/'],a[href^='http']");
        // console.log("Found " + relativeLinks.length + " relative links on page");
        var self = this
        relativeLinks.each(function () {
            if (!self.checkUrl($(this).attr('href'))) {
                return true;
            }
            if ($(this).attr('href').substr(0, 1) === "/") {
                self.pagesToVisit.push(self.baseUrl + $(this).attr('href'));
            } else {
                if ($(this).attr('href').match(self.url.hostname)) {
                    self.pagesToVisit.push($(this).attr('href'));
                }
            }
        });
    }

    searchForWord($, word) {
        var bodyText = $('html > body').text().toLowerCase();
        return (bodyText.indexOf(word.toLowerCase()) !== -1);
    }


}
new CrawlLinks(pages[0], false)
