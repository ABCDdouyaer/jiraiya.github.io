# 微信公众号开发之JS-SDK相关流程

> 通过使用微信JS-SDK，网页开发者可借助微信提供的api在微信浏览器中高效地使用拍照、选图、语音、位置等手机系统的能力，同时可以直接使用微信分享、扫一扫、卡券、支付等微信特有的能力，为微信用户提供更优质的网页体验。

## 准备工作

### 1. 同获取用户信息及其openId流程一样，绑定安全域名及添加IP白名单，查看接口权限

### 2.引入js-sdk文件

## 开发流程

### 1. 获取access_token

调用接口https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET获取access_token （access_token的有效期为2小时）

参数说明

<table><thead><tr><th>参数</th><th>是否必须</th><th>说明</th></tr></thead><tbody><tr><td>grant_type</td><td>是</td><td>获取access_token填写client_credential</td></tr><tr><td>appid</td><td>是</td><td>第三方用户唯一凭证</td></tr><tr><td>secret</td><td>是</td><td>第三方用户唯一凭证密钥，即appsecret</td></tr></tbody></table>

返回值

<table><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>access_token</td><td>获取到的凭证</td></tr><tr><td>expires_in</td><td>凭证有效时间，单位：秒</td></tr></tbody></table>

### 2.用access_token换取jsapi_ticket

调用接口：https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi获取jsapi_ticket （jsapi_ticket的有效期为2小时）

### 3.利用jsapi_ticket,随机字符串，时间戳，当前网页的链接（不包括hash部分）按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1，对该字符串进行sha1签名得到签名

### 4.通过config接口注入权限验证配置

```
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名
    jsApiList: [] // 必填，需要使用的JS接口列表
});
```

验证失败触发失败接口

```
wx.error(function(res){
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});
```

验证成功可以在ready接口中调用所需要的api

```
wx.ready(function(){
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
```

## 测试方式同获取用户信息及其openId的测试方式一样

## 参考资料

* [微信官方文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)