const urllib = require('urllib');

module.exports = async (ctx, next)=>{
    const req = ctx.request;
    let openId = G_Redis.get('openId');//redis中获取
    if(openId){
        let userInfo = G_Redis.get('userInfo');//redis中获取
        if(userInfo){
            next();  
        }else{
            await getUserInfo();//
            next()
        }
    }else{
        const code = req.query.code;
        if(code){
            await getOpenId(code);//获取openid并存入redis
            await getUserInfo();//
            next();
        }else{
            const type = 'snsapi_userinfo';//手动授权
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
                    //缓存openId永久
                    G_Redis.add('openId', res.data.openid, 'forever');
                    //缓存access_token 有效期2小时
                    G_Redis.add('oauth_accessToken', res.data.access_token, res.data.expires_in + Date.now());
                    //缓存用于刷新的access_token 有效期30天
                    G_Redis.add('oauth_refreshaccessToken', res.data.refresh_token, 30 * 24 * 60 * 60 + Date.now());
                    resolve(res.data.openid);
                }else{
                    reject(res.statusMessage);
                } 
            })
    })
}



async function getUserInfo(){
    let openId = G_Redis.get('openId');//redis中获取
    let oauth_accessToken = G_Redis.get('oauth_accessToken');//redis中获取
    return new Promise((resolve, reject) => {
        urllib.request(
            'https://api.weixin.qq.com/sns/userinfo',
                {
                    method: 'GET',
                    dataType: 'json',
                    data: {
                        access_token:oauth_accessToken,
                        openid: openId,
                        lang: 'zh_CN'
                    }
                }).then(res => {
                if(res.status === 200){
                    //缓存openId永久
                    G_Redis.add('userInfo', res.data, 'forever');
                    resolve(res.data);
                }else{
                    reject(res.statusMessage);
                } 
            })
    })
}