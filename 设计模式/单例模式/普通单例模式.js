var Singleton = function(name){
    this.name = name;
    this.instance = null;
}

Singleton.prototype.getName = function(){
    return this.name;
}

Singleton.getInstance = function(name){
    if(!this.instance){
        this.instance = new Singleton(name);
    }
    return this.instance;
}

var obj1 = Singleton.getInstance('小明');
var obj2 = Singleton.getInstance('小红');

console.log(obj1.getName());// 小明
console.log(obj2.getName());//小明
console.log(obj1 === obj2);//true