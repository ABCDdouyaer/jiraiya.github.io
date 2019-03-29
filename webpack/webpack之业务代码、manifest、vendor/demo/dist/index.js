(function(modules){
    var installedModules = {};//缓存加载文件结果
    function __webpack_require__(moduleId){
        if(installedModules[moduleId]){
            return installedModules[moduleId].exports;
        }

        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        }

        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        module.l = true;

        return module.exports;
    }

    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;

    //判断一个对象自身是否有某个属性
    __webpack_require__.o = function(object, property){
        return Object.prototype.hasOwnProperty.call(object, property);
    }

    __webpack_require__.d = function(exports, name, getter){
        if(!__webpack_require__.o(exports, name)){
            Object.defineProperty(exports, name, {
                configurable: false,//不能更改访问器属性
                enumerable: true,
                get: getter
            })
        }
    }

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