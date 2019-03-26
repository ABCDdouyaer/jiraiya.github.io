const path = require('path');
const fs = require('fs-extra');

let myPath = {
    'ROOT_PATH':{
        value: path.resolve(__dirname, '../'),
        writable: false,
    },
    'COMMON_PATH':{
        value: __dirname,
        writable: false,
    },
    'CONTROLLER_PATH':{
        value: path.resolve(__dirname, '../', 'controller'),
        writable: false,
    },
    'TEMPLATE_PATH':{
        value: path.resolve(__dirname, '../', 'template'),
        writable: false,
    },
    'STATIC_PATH':{
        value: path.resolve(__dirname, '../', 'static'),
        writable: false
    },
    'DATA_PATH':{
        value: path.resolve(__dirname, '../', 'data'),
        writable: false
    },
    'POLICY_PATH':{
        value: path.resolve(__dirname, '../', 'policy'),
        writable: false
    }
};
// //将常用路径挂载到全局
Object.defineProperties(global,myPath);


//收集Policy
function getPolicy(){
   let files = fs.readdirSync(POLICY_PATH);
   let filter_files = files.filter(e=>{
       return e.endsWith('.js');
   })
   
   let policyObj = {};
   filter_files.forEach(e=>{
       policyObj[e] = require(POLICY_PATH+'/'+e)
   })
   return policyObj;
}

//将Policy挂载到全局
Object.defineProperty(global, 'policyObj',{
    value: getPolicy(),
    writable: false
});

//收集公共配置

function getCommonConfig(){
   let files = fs.readdirSync(COMMON_PATH + '/config');
   let filter_files = files.filter(e=>{
       return e.endsWith('.js');
   })
   
   let commonConfig = {};
   filter_files.forEach(e=>{
       commonConfig = Object.assign(commonConfig, require(COMMON_PATH + '/config/' + e))
   })
   return commonConfig;
}

//将Policy挂载到全局
Object.defineProperty(global, 'G_CommonConfig',{
    value: getCommonConfig(),
    writable: false
});

//启用模拟redis

Object.defineProperty(global, 'G_Redis',{
    value: require('./utils/simulation_redis.js'),
    writable: false
});

//挂载微信常用方法

Object.defineProperty(global, 'G_Wx',{
    value: Object.assign(require('./utils/wx_method.js')),
    writable: false
});