(function ($) {

    var growTemplate = function () {
    };

    /**
     * ページトップヘ戻る
     */
    growTemplate.prototype.pageTop = function () {
        $('.js-pagetop').on('click', function (e) {
            e.preventDefault();
            $('body,html').animate({
                scrollTop: 0
            }, 500);
        });
    }

    $(function(){
        var app = new growTemplate();
        app.pageTop();
    });


})(jQuery);
