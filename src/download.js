/*
 * @Date: 2020-04-21 13:27:38
 * @LastEditTime: 2020-04-21 13:48:23
 * @Description: file content
 */
/**
 * Created by Administrator on 2017/10/24 0024.
 */
; (function ($) {
    var ua = window.navigator.userAgent.toLowerCase();
    var dpr = document.documentElement.dataset.dpr || window.devicePixelRatio
    function _IsInApp() {
        return ua.indexOf('asdf') > 1;
    }
    function generaterFooter() {
        let downLoadImgUrl = 'https://content.1234.com.cn/m/assets/img/pic_bg.png'
        let $footer = $('<div />', {
            "id": "web-track-downloadApp",
            "css": {
                'position': 'fixed',
                "display": "flex",
                "justify-content": "flex-end",
                "align-items": "center",
                'left': 0,
                'right': 0,
                'bottom': 0,
                'width': '100%',
                'height': 60 * dpr,
                'z-index': 99,
                'background-image': 'url(' + downLoadImgUrl + ')',
                'background-size': '100% 100%'
            }
        })
        let img = $("<img />", {
            "src": downLoadImgUrl,
            "css": {
                "position": "absolute",
                "top": 0,
                "left": 0,
                "width": "100%",
                "height": "100%",
            }
        })
        let $a = $('<a />', {
            "class": "web-track-download",
            "css": {
                "position": "absolute",
                "top": 0,
                "left": 0,
                "width": "100%",
                "height": "100%",
                "color": "#fff",
                "text-decoratio": "none"
            }
        })
        $footer.append($a)
        $footer.on("click", ".web-track-download", function () {
            window.location = '下载链接';
        })
        let closeimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAVUExURf///0xpcf///////////////////ybWoNgAAAAHdFJOUx8A0g9czVgR5p0BAAABIklEQVRIx5WWTQ6CMBCFnym61nCDRvclXIBwAuPCtRvvfwX7RzqFaV+chGCcL483pZ0BNxHjDB/zJP+DSDvkMCowQsR0BKq8IKDnC7EBOEQNuCNgJDBCiUkATgNMAVSBLIGmQJZAWyBJoC2QJKCugVgLf13bwCkCrg2YCAC9Z6BdQ6oDPQvBBHoWggl0LXgTEvgu6T68JVA8Xl739GN9fIpLFI9na6PEYO2zuBSAT0SJNYMZEEWkzMblMiSQUpVADcRcLeABGSFZC+zDZ2uBfQwBWHoru/YFOEAfwUyqZdKF+mep9ZdFXzfdMHTL0U3Ltz09OPTo0cNLjz9vILQF0SbG2yBtpLQV82ZOxwEfKHQk8aHGxyIdrHw0S6f6cG98HvwAODk7pTzy15gAAAAASUVORK5CYII='
        let $colsed = $("<div />", {
            "id": "web-track-downclose",
            "css": {
                "width": 32 * dpr,
                "height": 32 * dpr,
                "background": '#4c3e36 url(' + closeimg + ') no-repeat',
                'background-size': '100%',
                "margin-right": "4%",
                "border-radius": "50%",
                "z-index": 100
            }
        });
        $footer.append($colsed);
        $footer.on("click", "#haina-track-downclose", function () {
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
    if (!_IsInApp() && $.getQuertString("innerapp") === 'asdf') {
        generaterFooter()
    }


})(Zepto);

