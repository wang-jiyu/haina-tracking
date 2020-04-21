

; (function ($) {
    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    var xFetch = /** @class */ (function () {
        function xFetch(base_url, callback_timeout) {
            this.base_url = base_url;
            this.callback_timeout = callback_timeout || 0;
        };
        xFetch.prototype.initConfig = function (url, method, params, options) {
            let realoptions = {
                type: method,
                url: `${this.base_url}${url}`,
                data: method === 'get' ? params : JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                timeout: this.callback_timeout,
                ...options
            }
            return realoptions
        };
        xFetch.prototype.request = function ({ url, method, params, options } = config) {
            return new Promise((resolve, reject) => {
                try {
                    if (method === 'get') {
                        $.get(url, params, (data, status) => {
                            if (status > 300) {
                                reject(data)
                            } else {
                                resolve(data)
                            }
                        })
                    } else {
                        let realoptions = this.initConfig(url, method, params, options)
                        realoptions = Object.assign(realoptions, {
                            success: (data) => {
                                resolve(data)
                            },
                            error: (xhr, type) => {
                                reject(xhr, type)
                            }
                        })
                        $.ajax(realoptions)
                    }

                } catch (err) {
                    console.log('服务端返回异常')
                    reject(err)
                }
            })
        }

        xFetch.prototype.get = function (url, params, options) {
            return this.request({
                url, method: 'get', params, options
            })

        }

        xFetch.prototype.post = function (url, params, options) {
            console.log(JSON.stringify(params))
            return this.request({
                url, method: 'post', params, options
            })
        }

        xFetch.prototype.put = function (url, params, options) {
            return this.request({
                url, method: 'put', params, options
            })
        }

        xFetch.prototype.delete = function (url, params, options) {
            return this.request({
                url, method: 'delete', params, options
            })
        }
        return xFetch;
    }());

    window.xFetch = new xFetch('')
    var track = (function () {
        let pageViewMap = {
            '/mine/order/orderDetails': {
                "1": "DZFOrder_Detail_Enter",
                "2": "YZFOrder_Detail_Enter",
                "3": "YQXOrder_Detail_Enter"
            },
            '/news/information': {
                "homerecommend": "HQ_XW_Detail_Leave"
            },
            '/news/information/newsDetails': {
                "notice": "HQ_GG_Detail_Leave",
                "researchReport": "HQ_YB_Detail_Leave"
            }
        }
        let enterWhiteList = [
            '/quickLogin'
        ]
        function track(config) {
            this.url = {
                production: 'https://stat2.1234.com.cn/stat',
                test: 'https://stat-test.1234.com.cn/stat',
                test2: 'https://stat-test.1234.com.cn/stat',
                dev1: 'http://stat-test.1234.com.cn/stat',
                dev2: 'http://stat-test.1234.com.cn/stat',
                bug: 'https://stat-bug.1234.com.cn/stat',
                development: '/track'
            }
            this.config = {
                data: {
                    agent: '',
                    idfa: '',
                    appVersion: '',
                    mobileType: '',
                    channel: '',
                    osVersion: '',
                    manufacturer: '',
                    netEnvType: '',
                    ip: '',
                    userId: '',
                    signature: ''
                },
                max_referrer_string_length: 200,//referer字符串截取最大长度
                callback_timeout: 10000,
                is_track_device_id: false,//埋点的设备id
                use_app_track: false,//后期可能使用，在app内的时候，所有埋点数据，都推送到app，由app推送到服务端
                server_url: this.url[this.server_config()],
                isAutoTrack: false,
                isSinglePage: true
            }

            this.appVersion = window.navigator.appVersion

            this.init(config)
        };
        track.prototype.init = function (config) {
            this.initHeader()
            this.config = Object.assign({}, this.config, config)
            this.HttpIntance = new xFetch(this.config.server_url, this.config.callback_timeout)
            if (this.config.isAutoTrack) {

                if (this.config.isSinglePage) {
                    this.autoTrackSinglePage()
                } else {
                    this.autoTrack()
                }
            } else {
                this.customTrack()
            }
            this.pageView()
            //设置用户属性
            //设置页面来源referrer: document.referrer单页面有问题
            //自定义事件追踪
            //页面停留时间
            //页面访问pv，uv,单页面应用有问题

        };
        track.prototype.encryptByDES = function (message, key) {
            var keyHex = CryptoJS.enc.Utf8.parse(key);
            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        }
        track.prototype.getAgent = function () {
            try {
                let app = this.appVersion
                let start = app.lastIndexOf(" ")
                let end = app.lastIndexOf("/")
                return app.substring(start + 1, end)
            } catch (err) {
                console.log('agent get error')
            }
        }
        track.prototype.getMobileType = function () {
            if (this.appVersion.match(/iphone|iPad|iPod|iOS/gi)) {
                return 'IOS'
            } else {
                return 'Android'
            }
        }
        track.prototype.getOsVersion = function () {
            try {
                if (this.appVersion.match(/iphone|iPad|iPod|iOS/gi)) {
                    let ios = this.appVersion.match(/OS (\d+_)*(\d+)/gi)[0]
                    if (ios) {
                        ios = ios.substr(3).split("_").join(".")
                    }
                    return ios
                } else {
                    let android = this.appVersion.match(/Android (\d+.)*(\d+)/gi)[0]
                    if (android) {
                        android = android.replace(/[ ]/g, "_")
                    }
                    return android
                }
            } catch (err) {
                console.log('osversion get error')
            }
        }
        track.prototype.getManufacturer = function () {
            try {
                if (this.appVersion.match(/iphone|iPad|iPod|iOS/gi)) {

                    return "Apple"
                } else {
                    let app = this.appVersion
                    let index = app.indexOf("Android")
                    let endIndex = app.indexOf(")", index)
                    app = app.substring(index, endIndex)
                    let seqindex = app.indexOf(";")
                    app = app.substr(seqindex + 1)
                    app = app.match(/[ ][\s\S]*[ ]/gi)[0].replace(/[ ]/g, "")
                    return `Android_${app}`
                }
            } catch (err) {
                console.log('manufacturer get error')
            }
        }
        track.prototype.getNetEnvType = function () {
            try {
                return window.navigator.connection && window.navigator.connection.effectiveType
            } catch (error) {
                console.log('NetEnvType get error')
            }
        }
        track.prototype.initHeader = function () {
            try {
                if (this.isApp()) {
                    window['getRequestHead'] = (result) => {
                        try {
                            let json = result
                            if (typeof json === 'string') {
                                json = JSON.parse(json)
                            }
                            console.log("getRequestHead-back", json)
                            this.getHeadEvent = json.headEvents
                            this.userId = json.userId
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    if (typeof window['webkit'] != 'undefined') {
                        console.log("<<<<<<<<<<<<<<<<<ios获取head")
                        const realParam = {
                            "nativeCallJS": "getRequestHead"
                        }
                        window['webkit'].messageHandlers.jsCallNative.postMessage(realParam);
                    } else if (/Android/i.test(window.navigator.userAgent)) {
                        console.log("<<<<<<<<<<<<<<<<<android获取head")
                        const realParam = {
                            "nativecalljs": "getRequestHead"
                        }
                        const paramstr = JSON.stringify(realParam)
                        window['asdf'].pushEvent(paramstr);
                    }
                    if (window.location.href.indexOf("web-test.1234.com.cn/tool.html") > -1 || window.location.href.indexOf("web.1234.com.cn/tool.html") > -1) {
                        if (typeof window.webkit != 'undefined') {
                            //ios
                            console.log("old<<<<<<<<<<<<<<<<<ios获取head")
                            window.webkit.messageHandlers.jsCallNative.postMessage({
                                "jsCallNative": "getRequestHead"
                            });
                        } else {
                            //android
                            console.log("old<<<<<<<<<<<<<<<<<android获取head")
                            window.android.getRequestHead();
                        }
                    }

                } else {
                    Object.assign(this.config, {
                        data: {
                            agent: this.getAgent(),
                            idfa: 'web-h5-9086',
                            appVersion: '',
                            mobileType: this.getMobileType(),
                            channel: '',
                            osVersion: this.getOsVersion(),
                            manufacturer: this.getManufacturer(),
                            netEnvType: this.getNetEnvType(),
                            ip: '',
                            userId: ''
                        }
                    })
                    this.getHeadEvent = this.encryptByDES(JSON.stringify(this.config.data), "www.9086")
                }
            } catch (error) {
                console.log("获取原生头部信息错误")
            }
        };
        track.prototype.isApp = function () {
            var ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf('hayner') > 1
        };
        track.prototype.pageView = function (url) {
            let _this = this
            window.onload = function (event) {
                try {
                    window["web-page-view-start"] = new Date()
                    let pathname = window.location.pathname
                    let search = window.location.search
                    let eventId = pageViewMap[pathname] || ''
                    if (typeof eventId === 'object') {
                        switch (pathname) {
                            case '/mine/order/orderDetails':
                                eventId = eventId[$.getQuertString("orderStatus")]
                                break;
                            default:
                                eventId = ''
                        }
                    }
                    if (enterWhiteList.includes(pathname)) {
                        eventId = "PV_UV_ROUTER" + pathname.replace(/\//ig, "_").toUpperCase()
                    }
                    if (eventId !== '') {
                        _this.HttpIntance.post('/appevent.jspa', { eventId, parameter: "", eventDate: new Date().Format("yyyy-MM-dd hh:mm:ss"), userId: _this.userId }, {
                            headers: {
                                headerEvent: _this.getHeadEvent
                            }
                        })
                    }
                    // 在页面关闭前,调用sa的track方法
                    window.onunload = function () {
                        let end = new Date();
                        let unpath = window.location.pathname
                        // if(unpath.indexOf("/preload")>-1){
                        //     unpath = $.getQuertString("hainapreview")
                        // }
                        let eventIdss = pageViewMap[unpath] || ''
                        let parameter = ""

                        // 如果用户一直不关闭页面，可能出现超大值，可以根据业务需要处理，例如设置一个上限
                        let duration = (end.getTime() - window["web-page-view-start"].getTime());
                        if (typeof eventIdss === 'object') {
                            switch (unpath) {
                                case '/news/information':
                                    if ($.getQuertString("module") === 'homerecommend') {
                                        eventIdss = eventIdss[$.getQuertString("module")]
                                        parameter = {
                                            newsId: $.getQuertString("newsId"), timeSpent: duration
                                        }
                                    } else {
                                        eventIdss = ''
                                    }

                                    break;
                                case '/news/information/newsDetails':

                                    if ($.getQuertString("module") === 'notice') {
                                        eventIdss = eventIdss[$.getQuertString("module")]
                                        parameter = {
                                            reportId: $.getQuertString("newsId"), timeSpent: duration
                                        }
                                    } else if ($.getQuertString("module") === 'researchReport') {
                                        eventIdss = eventIdss[$.getQuertString("module")]
                                        parameter = {
                                            researchId: $.getQuertString("newsId"), timeSpent: duration
                                        }
                                    } else {
                                        eventIdss = ''
                                    }

                                    break;
                                default:
                                    eventIdss = ''
                            }
                        }
                        // 定义一个记录页面停留时间的事件pageView,并且保存需要的属性(停留时间和当前页面的地址)
                        console.log("duration>>>>>>>>>>>>>>", duration)
                        console.log("eventIdss>>>>>>>>>>>>>>", eventIdss)
                        console.log("parameter>>>>>>>>>>>>>>", parameter)
                        if (eventIdss !== '') {
                            _this.HttpIntance.post('/appevent.jspa', { eventId: eventIdss, parameter, eventDate: new Date().Format("yyyy-MM-dd hh:mm:ss"), userId: _this.userId }, {
                                headers: {
                                    headerEvent: _this.getHeadEvent
                                },
                                async: false
                            })
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        track.prototype.handleTrack = function (eventId, parameter, async = true) {
            parameter = JSON.stringify(parameter)
            this.HttpIntance.post('/appevent.jspa', { eventId, parameter, eventDate: new Date().Format("yyyy-MM-dd hh:mm:ss"), userId: this.userId }, {
                headers: {
                    headerEvent: this.getHeadEvent
                },
                async
            })
        }
        track.prototype.customTrack = function () {
            try {
                let _this = this
                $(document).off("click", "[data-eventid]")
                $(document).on("click", "[data-eventid]", function (e) {
                    let eventId = $(this).data("eventid")
                    let parameter = {}
                    $(this).data("parameter") && $(this).data("parameter").split(",").forEach(element => {
                        let temp = element.split(":")
                        if (temp && temp.length > 0) {
                            parameter[temp[0]] = temp[1]
                        }

                    });
                    parameter = JSON.stringify(parameter)
                    let async = $(this).data("async")

                    _this.HttpIntance.post('/appevent.jspa', { eventId, parameter, eventDate: new Date().Format("yyyy-MM-dd hh:mm:ss"), userId: _this.userId }, {
                        headers: {
                            headerEvent: _this.getHeadEvent
                        },
                        async: !async
                    })

                })
            } catch (error) {
                console.log(error)
            }
        };
        track.prototype.autoTrack = function () {
            let aList = $("a")
            aList.off("click")
            aList.on("click", () => {

            })
            let butonList = $("button")
            butonList.off("click")
            butonList.on("click", () => {

            })
            let inputList = $("input")
            inputList.off("click")
            inputList.on("click", () => {

            })
            //图片点击
        };
        track.prototype.autoTrackSinglePage = function () {

        };
        HNtrack.prototype.server_config = function () {
            let env = 'production'
            if (window.location.hostname.split('.').length > 0 && !(window.location.hostname.indexOf("localhost") > -1)) {
                let hostname = window.location.hostname.split('.')[0]
                if (hostname.indexOf("-") > -1) {
                    env = hostname.substring(hostname.indexOf("-") + 1)
                    // env = 'testing'
                }
            } else if (window.location.hostname.indexOf("localhost") > -1) {
                env = 'development'
            }
            return env
        };
        return HNtrack;
    }())

    window.track = track
})(Zepto)

