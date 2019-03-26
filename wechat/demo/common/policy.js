let filter = {
    'GET /admin': 'login.js',
    'GET /getdata': 'auth.js',
    'POST /upload': 'auth.js',
    'GET /getopenid': 'get_openid.js',
    'GET /getuserinfo': 'get_userinfo.js'
}

module.exports = function(){
    return async(ctx, next)=>{
        let method = ctx.request.method;
        let url = ctx.path;
        let str = `${method} ${url}`;
        if(filter[str]){
          await policyObj[filter[str]](ctx, next);
        }else{
            await next();
        }      
    }
}