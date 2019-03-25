
function EventEmitter(){
    this._listeners = {};
}

EventEmitter.prototype.on = function( eventName, fn, context){
    if( ! this._listeners[eventName] ){
        this._listeners[eventName] = [];
    }
    //不允许同一个function被多次绑定到同一个事件上
    var canBind = true;
    var fnArray = this._listeners[eventName];
    for( var i = 0, len = fnArray.length; i < len; i++ ){
        var fnObj = fnArray[i];
        if( fnObj.fn === fn){
            canBind = false;
            break;
        }
    }
    if( canBind ){
        fnArray.push({
            fn : fn,
            context : context ? context : null
        });
    }
    return this;
};

EventEmitter.prototype.off = function( eventName, fn){
    if( ! eventName ){
        this._listeners = null;
        return this;
    }
    var fnArray = this._listeners[eventName];
    if( ! fnArray || fnArray.length < 1 ){
        return this;
    }

    for( var i = 0, len = fnArray.length; i < len; i++ ){
        var fnObj = fnArray[i];
        if( fnObj.fn === fn){
            fnArray.splice( i, 1);
            return this;
        }
    }
    return this;
};

EventEmitter.prototype.emit = function( eventName, args ){
    var fnArray = this._listeners[eventName];
    if( ! fnArray || fnArray.length < 1 ){
        return this;
    }
    //防止在 下面的回调执行过程中,前面的 回调函数,修改了原始 fnArray 的大小,导致后面的数组越界
    fnArray = fnArray.slice();
    for( var i = 0, len = fnArray.length; i < len; i++ ){
        var fnObj = fnArray[i];
        if( typeof fnObj.fn === 'function'){
            fnObj.fn.call( fnObj.context, args);
        }
    }

    return this;
};

//全局事件中心
var eventCenter =  new EventEmitter();

eventCenter.on('err', function(e){
    console.log(e)
})

eventCenter.emit('err', '错误信息');
