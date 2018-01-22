/**
 * Created by Administrator on 2017/10/24 0024.
 */
;(function () {
    var ua = window.navigator.userAgent.toLowerCase();

    function _IsInApp() {
        return ua.indexOf('hayner') > 1;
    }
    $.fn.downLoadApp = function (options) {

        options = $.extend({
            boxHeight: '1.2rem',
            downImg: "downImg",
            colsed: "colsed",
            downLoadImgUrl: ''
        }, options);

        return this.each(function (i) {
            if ($(this).find('.' + options.downImg).length <= 0) {
                var downImg = $("<div />", {
                    "class": options.downImg,
                    "css": {
                        "width": '100%',
                        "height": options.boxHeight,
                        'background': 'url(' + options.downLoadImgUrl + ')',
                        'background-size': '100%'
                    }
                });
                $(this).append(downImg);
                $('.' + options.downImg).click(function () {
                    window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.sz.nniu';
                })
            }

            if (!$(this).find('.' + options.colsed).length <= 0) {
                var colsed = $("<div />", {
                    "class": options.colsed,
                    "css": {
                        "width": '0.5rem',
                        "height": '0.5rem',
                        "background": 'red',
                        "position": 'absolute',
                        "right": '0.5rem',
                        "top": '-0.5rem'
                    }
                });
                $(this).append(colsed);
                $('.' + options.colsed).click(function () {
                    $(this).parent().hide();
                })
            }

            $(this).css({
                'position': 'fixed',
                'left': 0,
                'bottom': 0,
                'width': '100%',
                'height': options.boxHeight,
                'z-index': 99
            });

            if (_IsInApp()) {
                $(this).hide();
            }

        });

    };
    
    if (!_IsInApp()) {
        // $("body").css("margin-bottom","1.2rem")
        $('html').append('<div id="downloadApp"></div>');
        $('#downloadApp').downLoadApp({
            downLoadImgUrl: 'https://m2.0606.com.cn' + '/assets/images/zx_load.png'
        });
    }


})();

