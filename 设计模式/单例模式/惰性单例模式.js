var getSingleton = function(fn){
    var result;
    return function(){
        return result || (result = fn.apply(this, arguments))
    }
}

var CreateDiv = function(){
    var div = document.createElement('div');
    div.innerHTML = '我说惰性单例模式';
    document.body.appendChild(div);
    return div;
}

var createLayerSingleton = getSingleton(CreateDiv);

createLayerSingleton();