const urllib = require('urllib');
const qrCodeUrlPrefix = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=';


//获取access_token
async function getAccessToken(){
    let accessToken = G_Redis.get('accessToken');//redis中获取
    return new Promise((resolve, reject) =>{
        if(!accessToken){//redis中不存在,接口获取后存入redis
            urllib.request(
                `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${G_CommonConfig.TEST_APPID}&secret=${G_CommonConfig.TEST_APPSECRET}`,
                 {
                    dataType: 'json'
                 }).then(res => {
                if(res.status === 200){
                    accessToken = res.data.access_token;
                    G_Redis.add('accessToken', accessToken, res.data.expires_in * 1000 + Date.now());
                    resolve(accessToken);
                }else{
                    reject(res.statusMessage);
                } 
            }).catch(err => {
                reject(err)
            })
         }else{
            resolve(accessToken);
         }
    })

}

//获取jsApi_ticket
async function getJsApiTicket(){
    let jsApiTicket = G_Redis.get('jsApiTicket');//redis中获取
    const accessToken = await getAccessToken();
    return new Promise((resolve, reject) => {
        if(!jsApiTicket){
            urllib.request(
                `https://api.weixin.qq.com/cgi-bin/ticket/getticket`,
                {
                    dataType: 'json',
                    method: 'GET',
                    data: {
                        access_token: accessToken,
                        type: 'jsapi'
                    }
                }
            ).then(res => {
                if(res.status === 200){
                    jsApiTicket = res.data.ticket;
                    G_Redis.add('jsApiTicket', jsApiTicket, res.data.expires_in * 1000 + Date.now());
                    resolve(jsApiTicket);
                }else{
                    reject(res.statusMessage);
                } 
            })
        }else{
            resolve(jsApiTicket)
        }
    })
}


//获取带场景值的二维码
async function getQrCode(){
    let qrCode = G_Redis.get('qrCode');//redis中获取
    const accessToken = await getAccessToken();
    return new Promise((resolve, reject) => {
        if(!qrCode){//redis中不存在,接口获取后存入redis
            urllib.request(
                `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`,
                {
                    dataType: 'json',
                    method: 'POST',
                    data: "{\"expire_seconds\": 7200, \"action_name\": \"QR_SCENE\", \"action_info\": {\"scene\": {\"scene_id\": 123}}}"
                }).then(res => {
                if(res.status === 200){
                    qrCode = qrCodeUrlPrefix + res.data.ticket;
                    G_Redis.add('qrCode', qrCode, res.data.expire_seconds * 1000 + Date.now());
                    resolve(qrCode);
                }else{
                    reject(res.statusMessage);
                } 
            }).catch(err => {
                console.log(err)
            })
        }else{
            resolve(qrCode);
        }
    
    })
}


async function getUserInfo(){
    const openId = G_Redis.get('openId');//redis中获取
    const accessToken = await getAccessToken();
    return new Promise((resolve, reject) => {
        urllib.request(
            'https://api.weixin.qq.com/cgi-bin/user/info',
                {
                    method: 'GET',
                    dataType: 'json',
                    data: {
                        access_token:accessToken,
                        openid: openId,
                        lang: 'zh_CN'
                    }
                }).then(res => {
                if(res.status === 200){
                    resolve(res.data);
                }else{
                    reject(res.statusMessage);
                } 
            })
    })
}
module.exports = {
    getAccessToken,
    getJsApiTicket,
    getQrCode,
    getUserInfo
}