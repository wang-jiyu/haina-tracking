

export default class HNtrack {

    constructor(config){
        this.init(config)
    }

    init(config){
        this.config = Object.assign({},this.config,config)
        if(this.config.isAutoTrack){
            this.autoTrack()
        }
    }

    autoTrack(){
        let aList = document.getElementsByTagName("a")
        aList.addEventListener("click",()=>{
            
        })
        let butonList = document.getElementsByTagName("button")
        butonList.addEventListener("click",()=>{
            
        })
        let inputList = document.getElementsByTagName("input")
        inputList.addEventListener("click",()=>{
            
        })
    }

    config = {
        max_referrer_string_length:200,//referer字符串截取最大长度
        callback_timeout: 1000,
        is_track_device_id: false,//埋点的设备id
        use_app_track: false,//后期可能使用，在app内的时候，所有埋点数据，都推送到app，由app推送到服务端
        server_url:'',
        isAutoTrack:false
    }
}

window.HNtrack = HNtrack