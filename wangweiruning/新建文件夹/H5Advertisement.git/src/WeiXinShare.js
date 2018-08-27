/**微信分享*/
export default class WeiXinShare{
    constructor(){
        console.log("微信分享SDK",wx);
        if(wx){

            var baseURI = window.location.origin + window.location.pathname;
            baseURI = baseURI.replace(/index\.html/, '');
            var shareUrl = baseURI + 'index.html';
            var shareImg = baseURI + 'assets/share.png';

            //默认模板
            this.obj = {
                title: '这个七夕，永恒印记耀你心动！', // 分享标题
                desc: '', // 分享描述
                link: shareUrl,
                imgUrl:shareImg, // 自定义图标
                type: 'link',
                dataUrl: '',
                success:function(res){
                    console.log("分享成功");
                }
            }
            
            this.init();

        }else{
            console.log("微信SDK未加载");
        }
    }
    weReady=false;
    init=()=>{
        let _this = this;
        var config = {};
        wx.ready(function () {
            console.log("微信:ready");
            _this.weReady = true;
            _this.setMenuShareTimeline();
            _this.setMenuShareAppMessage({
                title:"这个七夕，永恒印记耀你心动！",
                desc:"和TA一起，解锁七夕心动密码",
            });
        })
        var initWeixinShareA = () => {
            wx.config(config);
        };
        if (location.href.indexOf("infinitysia.com") > 0) {
            $.ajax({
                url: "//api.infinitysia.com/index/getSignPackage",
                type:"GET" ,
                dataType: 'jsonp',
                cache: false,
                jsonp: 'imCallback',
                success: function (json) {
                    config.debug = false;
                    var jd = json.data || json;
                    config.appId = jd.appId;
                    config.timestamp = jd.timestamp;
                    config.nonceStr = jd.nonceStr;
                    config.signature = jd.signature;
                    config.jsApiList = ['onMenuShareAppMessage', 'onMenuShareTimeline', 'hideOptionMenu'];
                    initWeixinShareA();
                }
            });
        }
        else {
            $.ajax({
                url: 'https://wx.asaplus.com.cn/wx/signpackage.php?url=' + encodeURIComponent(window.location.href),
                type: "GET",
                success: function (json) {
                    var obj= $.parseJSON(json);
                    config.debug = false;
                    config.appId = obj.appId;
                    config.timestamp = obj.timestamp;
                    config.nonceStr = obj.nonceStr;
                    config.signature = obj.signature;
                    config.jsApiList = ['onMenuShareAppMessage', 'onMenuShareTimeline', 'hideOptionMenu'];
                    initWeixinShareA();
                }
            });
        }
        
    }

    /**设置分享到朋友圈*/
    setMenuShareTimeline=(config)=>{
        let o = this.obj;
        if(config)o = {...o,...config};
        wx.onMenuShareTimeline(o);
    }

    /**设置分享给好友*/
    setMenuShareAppMessage=(config)=>{
        let o = this.obj;
        if(config)o = {...o,...config};
        wx.onMenuShareAppMessage(o);
    }

}