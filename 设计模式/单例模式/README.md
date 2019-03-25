> 单例模式的定义是：保证一个类只有仅有一个实例，并提供一个访问它的全局访问点。

##### 单例模式是一种常用的模式，有些对象我们往往只需要一个，比如线程池，全局缓存，window对象


### 简单单例模式
##### 要实现一个单例模式并不复杂，无非是用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的时候，直接返回之前创建的对象。

```
var Singleton = function(name) {
	this.name = name
	this.instance = null
}

Singleton.prototype.getName = function() {
	alert(this.name)
}

Singleton.getInstance = function(name) {
	if (!this.instance) {
		this.instance = new Singleton(name)
	}
	return this.instance
}
var a = Singleton.getInstance('sven1')
var b = Singleton.getInstance('sven2')  

alert(a===b) // true
```

##### 通过Singleton.getInstance来获取Singleton类的唯一对象，这种方式相对简单，但有问题，使用者并不知道这是一个单例类

### 用代理实现的单例模式

##### 我们现在的目标是实现一个透明的单例类，用户从这个类中获取对象的时候，可以像使用其他普通类一样。并且按照单一职责原则,createDiv类实现功能,proxySingletonCreateDiv类管理单例管理单例模式，达到可组合的的效果

```
// 创建普通类
var CreateDiv = function(html){
	this.html = html
	this.init()
}

CreateDiv.prototype.init = function() {
	var div = document.createComment('div')
	div.innerHTML = this.html
	document.body.appendChild(div)
}

//引入代理类
var proxySingletonCreateDiv = (function() {
	var instance
	return function(html) {
		if (!instance) {
			instance = new CreateDiv(html)
		}
		return instance
	}
})()

var a = new proxySingletonCreateDiv('sven1')
var b = new proxySingletonCreateDiv('sven2')  

alert(a===b) // true
```

### 惰性单例模式

##### 分离创建实例对象的职责与管理单例的职责。下面用创建一个登陆框举例

```
// 管理单例
var getSingle = function(fn) {
	var result
	return function() {
		return result || (result= fn.apply(this, arguments))
	}
}
var createLoginLayer = function() {
	var div = document.createElement('div')
	div.innerHTML = '我是登陆浮窗'
	div.style.display = 'none'
	document.body.appendChild(div)
	return div
}

var createSingleLoginLayer = getSingle(createLoginLayer)

document.getElementById('loginBtn').onclick = function(){
	var loginLayer = createSingleLoginLayer()
	loginLayer.style.display = 'block'
}
```

##### 单例模式是一种简单但非常使用的技术，特别是惰性单例技术，在合适的时候才创建对象，并且至创建唯一的一个。更奇妙的是，创建对象和管理单例的职责被分布在两个不同的方法中，这两个方法组合起来才具有单例模式的威力。
