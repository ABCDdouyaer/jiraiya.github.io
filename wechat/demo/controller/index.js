const env = require('../template/index');
const WechatTemplate = require('../common/utils/wx_template.js');
const crypto = require('crypto');

async function index_page(ctx, next){
    ctx.response.type = 'text/html';
    ctx.response.body = env.render('template/home/index/index.html')
}



async function notFound_page(ctx, next){
    ctx.response.type = 'text/html';
    ctx.response.body = env.render('template/home/notfound/index.html')
}


// 进行服务器校验及其微信消息的接收
async function wxCallBack(ctx, next){
    const method = ctx.request.method;
    const req = ctx.request;
    const res = ctx.response;
    //GET请求用来进行添加服务器地址的校验
    if(method === 'GET'){
        const { signature, timestamp, nonce, echostr } = req.query;
        const signatureTokens = [G_CommonConfig.TEST_TOKEN, timestamp, nonce].sort();
        const signStr = signatureTokens.join('');
        const hash = crypto.createHash('sha1');
        const calSignature = hash.update(signStr).digest('hex');
    
        if(signature == calSignature){
            res.body = echostr;
        }else{
            res.body = {
                status: 1,
                message: "微信接口配置校验签名失败！",
                data: "微信接口配置校验签名失败！"
            }
        }
    }else if(method === 'POST'){
        if(req.body.xml){
            //回应消息
            res.body = new WechatTemplate(req.body.xml).sendTpl();
        }else{
            //终止请求等待
            console.log('xml解析失败');
            res.body = 'success';
        }
    }
   
}

//渲染带场景值的二维码页面
async function qrCode_page(ctx, next){
   const url = await G_Wx.getQrCode();
   ctx.response.type = 'text/html';
   ctx.response.body = env.render('template/index/qrcode/index.html', {url});
}


//获取微信分享相关数据

async function getWxShare_data(ctx, next){
    const jsApiTicket = await G_Wx.getJsApiTicket();
    const configData = {
        nonceStr:  Math.random().toString(36).substr(2, 15),//随机字符串
        timestamp: Date.now(),//时间戳
        url: ctx.request.body.url,//当前页面的url不包括hash
        appId: G_CommonConfig.TEST_APPID, //appid
        jsApiTicket,
    }
    //加密算法获取签名
    let signatureStr = `jsapi_ticket=${jsApiTicket}&noncestr=${configData.nonceStr}&timestamp=${configData.timestamp}&url=${configData.url}`;
    configData.signature = crypto.createHash('sha1').update(signatureStr).digest('hex');
    configData.str = signatureStr
    ctx.response.body = configData;
}

//渲染微信分享页面
async function share_page(ctx, next){
    ctx.response.type = 'text/html';
    ctx.response.body = env.render('template/index/share/index.html');
}



//获取openid页面
async function getOpenId_page(ctx, next){
    ctx.response.type = 'text/html';
    ctx.response.body = env.render('template/index/openid/index.html',{openId: G_Redis.get('openId')});
}  





module.exports = {
    'GET /': index_page,//首页
    'GET /notfound':notFound_page,//404页面
    'GET /qrcode': qrCode_page,//生成带场景值的二维码页面
    'GET /share':share_page,//微信分享页面
    'GET /getopenid': getOpenId_page,//获取openid页面
    

    'POST /getWxShareData': getWxShare_data, //获取微信分享先关配置
    'ALL /wxCallBack': wxCallBack,//微信接收消息接口
}