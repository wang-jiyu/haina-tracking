/**
 * Created by Administrator on 2017/10/24 0024.
 */
;(function () {
    var ua = window.navigator.userAgent.toLowerCase();

    function _IsInApp() {
        return ua.indexOf('hayner') > 1;
    }
    function generaterFooter() {
        let $footer = $('<div />', {
            "id":"downloadApp",
            "css": {
                'position': 'fixed',
                'left': 0,
                'right':0,
                'bottom': 0,
                'width': '100%',
                'height': "1.2rem",
                'z-index': 99
            }
        })
        let downLoadImgUrl = 'https://m2.0606.com.cn/assets/images/zx_load.png'
        let $downImg = $("<div />", {
            "css": {
                "width": '100%',
                "height": "1.2rem",
                'background': 'url(' + downLoadImgUrl + ')',
                'background-size': '100%'
            }
        });
        let $a = $('<a />', {
            "class": "download",
            "css": {
                "position": "absolute",
                "top":0,
                "left":0,
                "width": "100%",
                "height": "100%",
                "color": "#fff",
                "text-decoratio": "none"
            }
        })
        $footer.append($downImg)
        $footer.append($a)
        $footer.on("click", ".download", function () {
            window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.sz.nniu';
        })
        let $colsed = $("<span />", {
            "class": "downclose",
            "css": {
                "display":"flex",
                "justify-content":"center",
                "align-items":"center",
                "width": '0.4rem',
                "height": '0.4rem',
                "background": '#777',
                "position": 'absolute',
                "right": "0.1rem",
                "top": "0.1rem",
                "border-radius":"50%",
                "font-size":"0.3rem",
                "color":"#aaa"
            }
        });
        $colsed.append("<strong style='background: #777;'>x</strong>")
        $footer.append($colsed);
        $footer.on("click", ".downclose", function () {
            $(this).parent().hide();
        })
        $('html').append($footer);
    }
    $.getQuertString = function (key) {
        let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
    if (!_IsInApp() && $.getQuertString("sharefrom") === 'hayner') {
        generaterFooter()
    }


})();

