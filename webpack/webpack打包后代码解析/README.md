#### 创建index.js文件内容

```
const a = require('./a.js');
a()
console.log('webpack')
```

#### 并且创建a.js文件内容
```
modules.exports = function(){
    console.log(2)
}
```

#### 修改index.js为

```
const { a }= require('./a.js');
a()
console.log('webpack')
```

#### 并且修改a.js为

```
exports.a = function(){
    console.log(2)
}

exports.b = function(){
    console.log(3)
}
```

#### 编译结果如下

```
(function(modules){
    var installedModules = {};//缓存加载文件结果

    //执行模块里面的代码
    function __webpack_require__(moduleId){
        if(installedModules[moduleId]){//缓存中存在就直接返回
            return installedModules[moduleId].exports;
        }

        var module = installedModules[moduleId] = {
            i: moduleId,//模块id
            l: false,//是否被调用
            exports: {}//调用返回的值
        }
        //执行模块代码并传入该模块对象 以及调用方法
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        //该模块已经被调用
        module.l = true;
        //返回模块调用的结果对象
        return module.exports;
    }

    __webpack_require__.m = modules;//所有模块集合
    __webpack_require__.c = installedModules;//缓存的模块执行结果

    //判断一个对象自身是否有某个属性
    __webpack_require__.o = function(object, property){
        return Object.prototype.hasOwnProperty.call(object, property);
    }
    //定义一个对象的属性值获取方法
    __webpack_require__.d = function(exports, name, getter){
        if(!__webpack_require__.o(exports, name)){
            Object.defineProperty(exports, name, {
                configurable: false,//不能更改访问器属性
                enumerable: true,
                get: getter
            })
        }
    }
    //默认值
    __webpack_require__.n = function(module){
        var getter = module && module._esModule ?
        function getDefault(){ return module['default']} :
        function getModuleExports(){ return module };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    }

    __webpack_require__.p = '';

    return __webpack_require__(__webpack_require__.s = 0);

})([
    (function(module, exports, __webpack_require__) {
        const a = __webpack_require__(1);
        a()
        console.log('webpack')
    }),

    (function(module, exports) {
        module.exports = function(){
            console.log(2)
        }  
     }) //传入数组包括所有模块
])

//默认值暴露
installedModules = {
    0: {
        moduleId: 0,
        l: true,
        exports: {}
    },
    1: {
        moduleId: 1,
        l: true,
        exports: function(){
            console.log(2)
        }
    }
}
//多值暴露
installedModules = {
    0: {
        moduleId: 0,
        l: true,
        exports: {}
    },
    1: {
        moduleId: 1,
        l: true,
        exports: {
            a: function(){console.log(2)},
            b: function(){console.log(3)}
        }
    }
}
//然后采用解构赋值 const { a } = installedModules[1].exports;
```