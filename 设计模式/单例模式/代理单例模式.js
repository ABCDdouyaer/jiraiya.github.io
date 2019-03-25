var CreateDiv = function(html){
    this.html = html;
    this.init();
}

CreateDiv.prototype.init = function(){
     var div = document.createElement('div');
     div.innerHTML = this.html;
     document.body.appendChild(div);
}

var ProxySingleton = (function(){
    var instance = null;
    return function(html){
        if(!instance){
            instance = new CreateDiv(html);
        }
        return instance;
    }
})()



var obj1 = new ProxySingleton('小明');
var obj2 = new ProxySingleton('小红');

console.log(obj1 === obj2);//true