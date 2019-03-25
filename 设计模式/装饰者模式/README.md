> 在传统的面向对象语言中，给对象添加功能常常使用继承的方式，但是继承的方式并不灵活， 还会带来许多问题:一方面会导致超类和子类之间存在强耦合性，当超类改变时，子类也会随之 改变;另一方面，继承这种功能复用方式通常被称为“白箱复用”，“白箱”是相对可见性而言的， 在继承方式中，超类的内部细节是对子类可见的，继承常常被认为破坏了封装性。装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。跟继承相比，装饰者是一种更轻便灵活的做法，这是一种“即用即付”的方式

**故事背景**

假设我们在编写一个飞机大战的游戏，随着经验值的增加，我们操作的飞机对象可以升级成更厉害的飞机，一开始这些飞机只能发射普通的子弹，升到第二级时可以发射导弹，升到第三级时可以发射原子弹。

**代码实现(使用装饰者模式)**

```
var plane = {
    fire: function(){
        console.log( '发射普通子弹' ); 
    }
}
var missileDecorator = function(){ 
    console.log( '发射导弹' );
}
var atomDecorator = function(){ 
    console.log( '发射原子弹' );
}
var fire1 = plane.fire;
plane.fire = function(){ 
    fire1();
    missileDecorator(); 
}
var fire2 = plane.fire;
plane.fire = function(){ 
    fire2();
    atomDecorator(); 
}
plane.fire();
// 分别输出: 发射普通子弹、发射导弹、发射原子弹
复制代码使用AOP实现装饰者模式
首先给出 Function.prototype.before 方法和 Function.prototype.after 方法
Function.prototype.before = function( beforefn ){
    var __self = this; // 保存原函数的引用
    return function(){ // 返回包含了原函数和新函数的"代理"函数
        beforefn.apply( this, arguments ); // 执行新函数，且保证 this 不被劫持，新函数接受的参数 // 也会被原封不动地传入原函数，新函数在原函数之前执行
        return __self.apply( this, arguments ); // 执行原函数并返回原函数的执行结果，  // 并且保证 this 不被劫持
} }
Function.prototype.after = function( afterfn ){ 
    var __self = this;
    return function(){
        var ret = __self.apply( this, arguments ); 
        afterfn.apply( this, arguments );
        return ret;
    } 
};
```

**AOP 的应用实例**

**数据统计上报**

比如页面中有一个登录 button，点击这个 button 会弹出登录浮层，与此同时要进行数据上报， 来统计有多少用户点击了这个登录 button

**未使用AOP**

```
var showLogin = function(){ 
   console.log( '打开登录浮层' ); 
   log( this.getAttribute( 'tag' ) );
}
var log = function( tag ){
   console.log( '上报标签为: ' + tag );
   (new Image).src = 'http:// xxx.com/report?tag=' + tag;
}
document.getElementById( 'button' ).onclick = showLogin;
```

**使用AOP**

```
var showLogin = function(){ 
    console.log( '打开登录浮层' );
}
var log = function(){
    console.log( '上报标签为: ' + this.getAttribute( 'tag' ) );
}
showLogin = showLogin.after( log ); // 打开登录浮层之后上报数据
document.getElementById( 'button' ).onclick = showLogin;
```

**插件式的表单验证**

我们很多人都写过许多表单验证的代码，在一个 Web 项目中，可能存在非常多的表单，如 注册、登录、修改用户信息等。在表单数据提交给后台之前，常常要做一些校验，比如登录的时 候需要验证用户名和密码是否为空

**未使用AOP**

```
var formSubmit = function(){
    if ( username.value === '' ){
        return alert ( '用户名不能为空' ); 
    }
    if ( password.value === '' ){
        return alert ( '密码不能为空' );
    }
    var param = {
        username: username.value, password: password.value
    }
    ajax( 'http:// xxx.com/login', param );
}
submitBtn.onclick = function(){ 
    formSubmit();
}
```

**使用AOP**

```
var validata = function(){
    if ( username.value === '' ){
        alert ( '用户名不能为空' );
        return false; 
    }
    if ( password.value === '' ){ 
        alert ( '密码不能为空' ); 
        return false;
    } 
}
var formSubmit = function(){ 
    var param = {
        username: username.value,
        password:password.value
    }
    ajax( 'http:// xxx.com/login', param ); 
}
formSubmit = formSubmit.before( validata );
submitBtn.onclick = function(){ 
    formSubmit();
}
```

**小结**

装饰者模式和代理模式的结构看起来非常相像，这两种模式都描述了怎样为对象提供 一定程度上的间接引用，它们的实现部分都保留了对另外一个对象的引用，并且向那个对象发送 请求。
代理模式和装饰者模式最重要的区别在于它们的意图和设计目的。代理模式的目的是，当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。本体定义了关键功能，而代理提供或拒绝对它的访问，或者在访问本体之前做一些额外的事情。装饰者模式的作用就是为对 象动态加入行为。
