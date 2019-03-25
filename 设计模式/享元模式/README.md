> 享元(flyweight)模式是一种用于性能优化的模式，“fly”在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。如果系统中因为创建了大量类似的对象而导致内存占用过高，享元模式就非常有用了。在 JavaScript 中，浏览器特别是移动端的浏览器分配的内存并不算多，如何节省内存就成了一件非常有意义的事情。

**故事背景**

假设有个内衣工厂，目前的产品有 50 种男式内衣和 50 种女士内衣，为了推销产品，工厂决定生产一些塑料模特来穿上他们的内衣拍成广告照片。 正常情况下需要 50个男模特和50个女模特，然后让他们每人分别穿上一件内衣来拍照。

**代码实现(未使用享元模式)**

```
var Model = function( sex, underwear){
    this.sex = sex;
    this.underwear = underwear;
};
Model.prototype.takePhoto = function(){
    console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
};
for ( var i = 1; i <= 50; i++ ){
    var maleModel = new Model( 'male', 'underwear' + i );     
    maleModel.takePhoto();
 };
for ( var j = 1; j <= 50; j++ ){
    var femaleModel= new Model( 'female', 'underwear' + j );
    femaleModel.takePhoto(); 
};
```

**思考：真的需要如此多数量的对象吗？**

如上所述，现在一共有 50 种男内 衣和 50 种女内衣，所以一共会产生 100 个对象。如果将来生产了 10000 种内衣，那这个程序可能会因为存在如此多的对象已经提前崩溃。

下面我们来考虑一下如何优化这个场景。虽然有 100 种内衣，但很显然并不需要 50 个男 模特和 50 个女模特。其实男模特和女模特各自有一个就足够了，他们可以分别穿上不同的内衣来拍照。

**代码重构(享元模式)**

```
/*只需要区别男女模特
那我们先把 underwear 参数从构造函数中 移除，构造函数只接收 sex 参数*/
var Model = function( sex ){ 
    this.sex = sex;
};
Model.prototype.takePhoto = function(){
    console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
};
/*分别创建一个男模特对象和一个女模特对象*/
var maleModel = new Model( 'male' ), 
    femaleModel = new Model( 'female' );
/*给男模特依次穿上所有的男装，并进行拍照*/
for ( var i = 1; i <= 50; i++ ){ 
    maleModel.underwear = 'underwear' + i; 
    maleModel.takePhoto();
};
/*给女模特依次穿上所有的女装，并进行拍照*/
for ( var j = 1; j <= 50; j++ ){ 
    femaleModel.underwear = 'underwear' + j; 
    femaleModel.takePhoto();
};
//只需要两个对象便完成了同样的功能

```

**如何使用享元模式**

享元模式要求将对象的属性划分为内部状态与外部 状态(状态在这里通常指属性)。享元模式的目标是尽量减少共享对象的数量，关于如何划分内部状态和外部状态，下面的几条经验提供了一些指引

    - 内部状态存储于对象内部
    - 内部状态可以被一些对象共享
    - 内部状态独立于具体的场景，通常不会改变
    - 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

在上面的例子中，性别是内部状态，内衣是外部状态，通过区分这两种状态，大大减少了系 统中的对象数量。通常来讲，内部状态有多少种组合，系统中便最多存在多少个对象，因为性别 通常只有男女两种，所以该内衣厂商最多只需要 2 个对象。

**享元模式的替代方案 —— 对象池**

对象池是另外一种性能优化方案，它跟享元模式有一些相似之处，但没有分离内部状态和外 部状态这个过程。对象池维护一个装载空闲对象的池子，如果需要对象的时候，不是直接 new，而是转从对象池里获取。如 果对象池里没有空闲对象，则创建一个新的对象，当获取出的对象完成它的职责之后， 再进入 池子等待被下次获取。

**通用对象池代码实现**

```
/*通用的对象池*/
var objectPoolFactory = function( createObjFn ){ 
    var objectPool = [];
    return {
        create: function(){
            var obj = objectPool.length === 0 ? createObjFn.apply( this, arguments ) : objectPool.shift();
            return obj; 
        },
        recover: function( obj ){ 
            objectPool.push( obj );
        }
    } 
};
var iframeFactory = objectPoolFactory( function(){ 
    var iframe = document.createElement( 'iframe' );
    document.body.appendChild( iframe );
    iframe.onload = function(){
        iframe.onload = null; // 防止 iframe 重复加载的 bug
        iframeFactory.recover( iframe );// iframe 加载完成之后回收节点
    }
    return iframe;
});
var iframe1 = iframeFactory.create(); 
iframe1.src = 'http:// baidu.com';
var iframe2 = iframeFactory.create(); 
iframe2.src = 'http:// QQ.com';
setTimeout(function(){
    var iframe3 = iframeFactory.create();
    iframe3.src = 'http:// 163.com'; 
}, 3000 );

```

