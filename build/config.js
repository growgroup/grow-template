export default {
  "APPPATH": "/"
}
config.wp = {
 // テーマ名
 'Name': 'grow-html-template',
 // テーマのURI
 'Uri': 'http://github.com/growgroup/grow-html-template',
 // 著者
 'Author': 'growgroup',
 // 著者URL
 'AuthorUri': 'http://grow-group.jp',
 // 説明文
 'Description': 'HTML Boilerplate',
 // バージョン
 'Version': '1.0.0',
 // ライセンス
 'License': 'GPL v3 or Later',
 // ライセンスの詳細が記載されているURI
 'LicenseUri': '',
 // 親テーマ名
 'Template': 'growp',
 // タグ
 'Tag': '',
 // テキストドメイン
 'TextDomain': 'grow-html-template',
 // その他
 'Option': ''
};

var wpThemeInfo = '@charset "UTF-8";\n'
 + '/*\n'
 + ' Theme Name: ' + config.wp.Name + '\n'
 + ' Theme URI: ' + config.wp.Uri + '\n'
 + ' Author: ' + config.wp.Author + '\n'
 + ' Author URI: ' + config.wp.AuthorUri + '\n'
 + ' Description: ' + config.wp.Description + '\n'
 + ' Version: ' + config.wp.Version + '\n'
 + ' Theme License: ' + config.wp.License + '\n'
 + ' License URI: ' + config.wp.LicenseUri + '\n'
 + ' Template: ' + config.wp.Template + '\n'
 + ' Tags: ' + config.wp.Tag + '\n'
 + ' Text Domain: ' + config.wp.TextDomain + '\n'
 + config.wp.Option
 + '*/\n';
