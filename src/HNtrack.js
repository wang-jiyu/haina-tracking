

;(function () {

    var xFetch = /** @class */ (function () {
        function xFetch(base_url,callback_timeout) {
            this.base_url = base_url;
            this.callback_timeout = callback_timeout || 0;
        };
        xFetch.prototype.initConfig = function(url, method, params, options) {
            let realoptions = {
                type: method,
                url:`${this.base_url}${url}`,
                data: params,
                contentType: 'application/json; charset=utf-8',
                timeout: this.callback_timeout,
                ...options
            }
            return realoptions
        };
        xFetch.prototype.request=function({ url, method, params, options } = config) {
            return new Promise((resolve, reject) => {
                try {
                    console.log(this.initConfig)
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
                    reject(err)
                }
            })
        }
    
        xFetch.prototype.get=function(url, params, options) {
            return this.request({
                url, method: 'get', params, options
            })
    
        }
    
        xFetch.prototype.post=function(url, params, options) {
            return this.request({
                url, method: 'post', params, options
            })
        }
    
        xFetch.prototype.put=function(url, params, options) {
            return this.request({
                url, method: 'put', params, options
            })
        }
    
        xFetch.prototype.delete=function(url, params, options) {
            return this.request({
                url, method: 'delete', params, options
            })
        }
        return xFetch;
    }());

    var HNtrack = (function () {
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
            this.init(config)
        };
        HNtrack.prototype.init = function (config) {
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

            //设置用户属性
            //设置页面来源referrer: document.referrer单页面有问题
            //自定义事件追踪
            //页面停留时间
            //页面访问pv，uv,单页面应用有问题

        };
        HNtrack.prototype.getSignature=function(param) {
            return md5(hmacSHA256(Object.keys(param).map(key => param[key])
                .join(":"), 'B5CE6EC82F9D474F845508E847B75F29').toString().toUpperCase()).toString()
        }
        HNtrack.prototype.getHeadEvents = function () {
            // data: {
            //     agent: '',
            //     idfa: '',
            //     appVersion: '',
            //     mobileType: '',
            //     channel: '',
            //     osVersion: '',
            //     manufacturer: '',
            //     netEnvType: '',
            //     ip: '',
            //     userId: '',
            //     signature: ''
            // },
            var md = new MobileDetect(window.navigator.userAgent);
            var os = md.os()
            var osVersion = ''
            var model = ''
            if (os == "iOS") {//ios系统的处理  
                osVersion = md.os() + md.version("iPhone");  
                model = md.mobile();  
            } else if (os == "AndroidOS") {//Android系统的处理  
                osVersion = md.os() + md.version("Android");  
                var sss = device_type.split(";");  
                var i = sss.contains("Build/");  
                if (i > -1) {  
                    model = sss[i].substring(0, sss[i].indexOf("Build/"));  
                }  
            } 
            Object.assign(this.config,{
                data:{
                    agent:md.userAgent(),
                    idfa:'',
                    appVersion:'',
                    mobileType:md.os(),
                    channel:'',
                    osVersion:osVersion,
                    manufacturer:model,
                    netEnvType:'',
                    ip:'',
                    userId:'',
                    signature:''
                }
            })
        };
        HNtrack.prototype.isApp = function (){
            var ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf('hayner') > 1
        };
        
        HNtrack.prototype.customTrack = function () {
            let _this = this
            $(document).off("click","[data-eventId]")
            $(document).on("click","[data-eventId]", function (e) {
                console.log('aaaaaaaaaaa')
                let eventId = $(this).data("eventId")
                let parameter = $(this).data("parameter").split(",")
                let headerEvent = _this.getHeadEvents()

                _this.HttpIntance.post('/appevent.jspa', { eventId, parameter }, {
                    headers: {
                        headerEvent
                    }
                })

            })
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
            if (window.location.hostname.split('.').length > 0) {
                let hostname = window.location.hostname.split('.')[0]
                if (hostname.indexOf("-") > -1) {
                    env = hostname.substring(hostname.indexOf("-") + 1)
                    // env = 'testing'
                }
            }else if(window.location.hostname.indexOf("localhost")>-1){
                env = 'development'
            }
            return env
        };
        return HNtrack;
    }())

    window.HNtrack = HNtrack

    new HNtrack()
})(Zepto)

