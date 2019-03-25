$(function(){
    $.ajax({
        url: '/getWxShareData',
        method: 'POST',
        dataType: 'json',
        data:{
            url: location.href
        },
        success: function(res){
            wxShare(res);
        },
        fail: function(err){
            console.log(err)
        }
    })
})

function wxShare(data){
    console.log('ddddddd')
    console.log(data)
    wx.config({
        debug: true,
        appId: data.appId,
        timestamp:data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList:[
            "checkJSApi",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareAppMessage",
            "onMenuShareWeibo",
            "hideMenuItems",
            "showMenuItems",
            "hideAllNonBaseMenuItem",
            "showAllNonBaseMenuItem",
            "translateVoice",
            "startRecord",
            "stopRecord",
            "onRecordEnd",
            "playVoice",
            "pauseVoice",
            "stopVoice",
            "uploadVoice",
            "downloadVoice",
            "chooseImage",
            "previewImage",
            "uploadImage",
            "downloadImage",
            "getNetworkType",
            "openLocation",
            "getLocation",
            "hideOptionMenu",
            "showOptionMenu",
            "closeWindow",
            "scanQRCode",
            "chooseWXPay",
            "openProductSpecificView",
            "addCard",
            "chooseCard",
            "openCard"
        ]
    })

    wx.ready(function(){
        const shareData = {
            desc: "新手专享10%参考年回报率，走心推荐人人贷，八年老平台，专业可信赖！",
            img_url: "https://m.renrendai.com/cms/58647d50e0286a10854d875a/mgm/wachat-new.jpg",
            link:"https://m.renrendai.com/mo/pb/cv1/page/pageId/5afac77a168da042e66c6726?share_id=UlJEX0NBVENIX05FV19SRUdJU1RFUjI0NTg0NDg%3D&",
            title:"送你1288元新手福利和专属现金大礼",
            type:"link"
        }
        //分享给朋友
        wx.onMenuShareAppMessage(shareData);
        //分享到朋友圈
        wx.onMenuShareTimeline(shareData);
        //onMenuShareQQ
        wx.onMenuShareQQ(shareData);
        //分享到腾讯微博
        wx.onMenuShareWeibo(shareData);
        //分享到QQ空间
        wx.onMenuShareQZone(shareData);
    })
}