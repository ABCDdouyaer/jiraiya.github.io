const urllib = require('urllib');

module.exports = async (ctx, next)=>{
    const req = ctx.request;
    let openId = G_Redis.get('openId');//redis中获取
    if(openId){
        next()
    }else{
        const code = req.query.code;
        if(code){
            await getOpenId(code);//获取openid并存入redis
            next();
        }else{
            const type = 'snsapi_base';
            let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${G_CommonConfig.TEST_APPID}&redirect_uri=${encodeURIComponent(ctx.request.href)}&response_type=code&scope=${type}&state=1#wechat_redirect`;
            ctx.redirect(url);
        }
    }
}

async function getOpenId(code){
    return new Promise((resolve, reject) => {
        urllib.request(
            'https://api.weixin.qq.com/sns/oauth2/access_token',
             {
                 method: 'GET',
                 dataType: 'json',
                 data: {
                     appid:G_CommonConfig.TEST_APPID,
                     secret: G_CommonConfig.TEST_APPSECRET,
                     code,
                     grant_type: 'authorization_code'
                 }
             }).then(res => {
                if(res.status === 200){
                    G_Redis.add('openId', res.data.openid, 60 * 60 * 60 * 60 * 1000 + Date.now());
                    resolve(res.data.openid);
                }else{
                    reject(res.statusMessage);
                } 
            })
    })
}