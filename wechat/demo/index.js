const koa = require('koa');
const app = new koa();
const session = require('koa-session');//解析session的中间件
require('./common/global');//收集公共配置并挂载到全局
const koaBody = require('koa-bodyparser');//解析post请求体
const xmlParser = require('koa-xml-body');//解析xml
const koaStatic = require('koa-static');//静态文件可访问
const policy = require('./common/policy');//请求拦截
const router = require('./common/router');//lu'you

app.keys = ['some secret hurr'];//设置session签名
 
const CONFIG = {//session的有效期
  key: 'koa:sess', 
  maxAge: 60*1000,
  renew: false, 
};


app.use(policy());
app.use(session(CONFIG, app));
app.use(xmlParser());
app.use(koaBody());
app.use(router.routes());
app.use(koaStatic(ROOT_PATH));
app.listen(80,()=>{
    console.log('app started at port 80...');
})
