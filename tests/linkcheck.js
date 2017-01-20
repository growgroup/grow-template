const pages = require("../package.json").checktools.pages
const exec = require('child_process').exec;

// ルートディレクトリ
var rootdir = __dirname.replace("tests","")
var command = rootdir + 'node_modules/broken-link-checker/bin/blc --input ' + pages[0] + ' -rof';
exec(command, (err, stdout, stderr) => {
    console.log(stdout)
});
