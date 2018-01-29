

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

    window.onerror = function (msg, url, l) {
        console.log(msg, url, l)
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
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                timeout: this.callback_timeout,
                ...options
            }
            return realoptions
        };
        xFetch.prototype.request = function ({ url, method, params, options } = config) {
            return new Promise((resolve, reject) => {
                try {
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

    var HNtrack = (function () {
        let pageViewMap = {
            '/mine/order/orderDetails': {
                "1": "DZFOrder_Detail_Enter",
                "2": "YZFOrder_Detail_Enter",
                "3": "YQXOrder_Detail_Enter"
            }
        }
        function HNtrack(config) {
            this.url = {
                production: 'https://stat.0606.com.cn/stat',
                test: 'https://stat-test.0606.com.cn/stat',
                test2: 'https://stat-test.0606.com.cn/stat',
                dev1: 'http://stat-test.0606.com.cn/stat',
                dev2: 'http://stat-test.0606.com.cn/stat',
                bug: 'https://stat-bug.0606.com.cn/stat',
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
            // console.log(encryptByDES(JSON.stringify({
            //     idfa:"72CD2664-E27A-451B-BC52-6654EDC44AD1",
            //     appVersion:"2.2.0",
            //     netEnvType:"wi-fi",
            //     imei:"72CD2664-E27A-451B-BC52-6654EDC44AD1",
            //     osVersion:"11.2",
            //     channel:"appStore",
            //     userId:"",
            //     manufacturer:"Apple",
            //     mobileType:"iOS",
            //     ip:"192.168.3.93",
            //     agent:"Hayner"
            // }),"www.9086")==="fdyG6YwtU/JsfyxKxad4zNE3RYxBKwK7WvXgcSWsbNaNuZ/mswFNyoKgz8mUCMJyddcVjo2C8uWQOqlZdijD7r5X2KrD5a9afcFlBIJ3rm/xTtga6hss5XnlMbD6u+ulbH8sSsWneMzRN0WMQSsCu1r14HElrGzWjbmf5rMBTcqCoM/JlAjCcvKzWfSeWXYMPsAT/qcJTrqIT/tPnhyT2ZWKhen1uh6YPgsUCSjWHxdTLVxOw+WCv8aISujooTRXQekzrAckXlN91fRtNj1RO2tw4tELBskaAZWlMXfox7eWQfeiNHMmROpd+2cS7S/evc6AD20SqDAsiteVzyVHdY/diizfTEdoXlYQcXWv30s=")

            this.init(config)
        };
        HNtrack.prototype.init = function (config) {
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
        HNtrack.prototype.encryptByDES = function (message, key) {
            var keyHex = CryptoJS.enc.Utf8.parse(key);
            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        }
        HNtrack.prototype.getAgent = function () {
            try {
                let app = this.appVersion
                let start = app.lastIndexOf(" ")
                let end = app.lastIndexOf("/")
                return app.substring(start + 1, end)
            } catch (err) {
                console.log('agent get error')
            }
        }
        HNtrack.prototype.getMobileType = function () {
            if (this.appVersion.match(/iphone|iPad|iPod|iOS/gi)) {
                return 'IOS'
            } else {
                return 'Android'
            }
        }
        HNtrack.prototype.getOsVersion = function () {
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
        HNtrack.prototype.getManufacturer = function () {
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
        HNtrack.prototype.getNetEnvType = function () {
            try {
                return window.navigator.connection && window.navigator.connection.effectiveType
            } catch (error) {
                console.log('NetEnvType get error')
            }
        }
        HNtrack.prototype.initHeader = function () {
            try {
                if (this.isApp()) {
                    window['getRequestHead'] = (result) => {
                        delete window['getRequestHead'];
                        try {
                            let json = result
                            if (typeof json === 'string') {
                                json = JSON.parse(json)
                            }
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
                        window['haina'].pushEvent(paramstr);
                    }
                    if(window.location.href.indexOf("web-test.0606.com.cn/tool.html")>-1||window.location.href.indexOf("web.0606.com.cn/tool.html")>-1){
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
                            idfa: '',
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
        HNtrack.prototype.isApp = function () {
            var ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf('hayner') > 1
        };
        HNtrack.prototype.pageView = function (url) {
            let _this = this
            window.onpageshow = function (event) {
                try {
                    let pathname = window.location.pathname
                    let search = window.location.search
                    let eventId = pageViewMap[pathname] || 'MOBILE_PV_ENTER'
                    if (typeof eventId === 'object') {
                        switch (pathname) {
                            case '/mine/order/orderDetails':
                                eventId = eventId[$.getQuertString("orderStatus")]
                                break;
                            default:
                                eventId = 'MOBILE_PV_ENTER'
                        }
                    }
                    _this.HttpIntance.post('/appevent.jspa', { eventId, parameter: "", eventDate: new Date().Format("yyyy-MM-dd hh:mm:ss"), userId: _this.userId }, {
                        headers: {
                            headerEvent: _this.getHeadEvent
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }
        HNtrack.prototype.handleTrack = function (eventId, parameter) {
            parameter = JSON.stringify(parameter)

            this.HttpIntance.post('/appevent.jspa', { eventId, parameter, eventDate: new Date().Format("yyyy-MM-dd hh:mm:ss"), userId: this.userId }, {
                headers: {
                    headerEvent: this.getHeadEvent
                }
            })
        }
        HNtrack.prototype.customTrack = function () {
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

                    _this.HttpIntance.post('/appevent.jspa', { eventId, parameter, eventDate: new Date().Format("yyyy-MM-dd hh:mm:ss"), userId: _this.userId }, {
                        headers: {
                            headerEvent: _this.getHeadEvent
                        }
                    })

                })
            } catch (error) {
                console.log(error)
            }
        };
        HNtrack.prototype.autoTrack = function () {
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
        HNtrack.prototype.autoTrackSinglePage = function () {

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

    window.HNtrack = HNtrack
})(Zepto)

