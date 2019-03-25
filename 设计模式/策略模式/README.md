> 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

在现实中，如果我们想去某个地方旅游，可以根据实际情况有多种路线

*   如果没有时间但是不在乎钱，可以选择飞机
*   如果没有钱，可以选择大巴或者火车
*   如果再穷一点，可以选择骑自行车

# 使用策略模式计算奖金

现在以年终奖的计算为例

公司年终奖根据员工的`工资基数`和`年底绩效`来发放

*   绩效S,四倍年终奖
*   绩效A,三倍年终奖
*   绩效B,二倍年终奖

## 最初的实现

```
var calculateBonus = function(performanceLevel, salary) {
	if (performanceLevel === 'S') {
		return salary*4
	}
	if (performanceLevel === 'A') {
		return salary*3
	}
	if (performanceLevel === 'B') {
		return salary*2
	}
}
calculateBonus('B', 2000) // 4000
calculateBonus('S', 2000) // 8000
```



这段代码简单，但是存在显而易见的缺点

1.  函数比较庞大，包含很多if-else语句，这些语句需要覆盖所有的逻辑分支
2.  缺乏弹性,如果想新增绩效C，就得深入函数内部实现，违反开放-封闭原则
3.  算法的复用性差

    ## 策略模式的实现

```
var strategies = {
	"S": function(salary) {
		return salary * 4
	},
	"A": function(salary) {
		return salary * 3
	},
	"B": function(salary) {
		return salary * 2
	}				
}
var calculateBonus = function(level, salary) {
	return strategies[level](salary)
}
console.log(calculateBonus('S', 2000)) // 8000
console.log(calculateBonus('B', 2000)) // 4000
```


通过使用策略模式重构代码，消除来原程序中分支语句。所有计算奖金有关的逻辑分布在策略对象中，每个策略对象的算法已被各自封装在对象内部，当我们对这些策略对象发出“计算奖金”的请求时，它们会返回各自的计算结果，这不仅是多态性的体现，也是“自由交换”的目的。

# 使用策略模式实现缓动动画

```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title></title>
	</head>
	<body>
	<div id="div" style="background: #141527;display: inline-block;position: relative;">我说div</div>
	<script type="text/javascript">
/**
 * 缓动算法
 * @t 已消耗的时间
 * @b 小球原始位置
 * @c 小球目标位置
 * @d 动画持续的总时间
 */
var tween = {
        Linear: function(t,b,c,d){ return c*t/d + b; },
	easeIn: function(t,b,c,d){ return c*(t/=d)*t + b;},
	easeOut: function(t,b,c,d){ return -c *(t/=d)*(t-2) + b;},
	easeInOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}
}

/**
 * 定义Animate类
 */
var Animate = function(dom) {
	this.dom = dom;			// 运动的元素
	this.startTime = 0;		// 动画开始时间
	this.startPos = 0;		// 元素初始位置
	this.endPos = 0;		// 元素结束位置
	this.propertyName = '';		// 实现动画的元素属性
	this.easing = null;		// 缓动算法
	this.duration = 0;		// 动画持续的时间
};

/**
 * 启动动画
 */
Animate.prototype.start = function(propertyName, endPos, duration, easing) {
	this.startTime = new Date();		// 初始化动画开始的时间
	this.startPos = this.dom.getBoundingClientRect()[propertyName];
	this.propertyName = propertyName;
	this.endPos = endPos;
	this.duration = duration;
	this.easing = tween[easing];		// 缓动算法
	var that = this;
	var timed = setInterval(function() {
		// 执行每帧操作
		if(that.step() === false) {		// 动画已结束
			clearInterval(timed);
		}
	}, 19);
};

// 判断当前动画状态，调用update
Animate.prototype.step = function() {
	var t = new Date();		// 执行动画的当前时间
	if( t.getTime() >= this.startTime.getTime() + this.duration) {		// 动画已结束
		this.update(this.endPos);
		return false;
	}
	var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
	this.update(pos);
};

// 计算位置更新属性
Animate.prototype.update = function(pos) {
	this.dom.style[this.propertyName] = pos + 'px';
};

var div = document.getElementById('div')
var animate = new Animate(div)
animate.start('top', 500, 1000, 'easeInOut')

	</script>	
	</body>
</html>
```

# 用策略模式实现表单验证

从定义上看，策略模式就是用来封装算法的。但是如果仅仅用来封装算法，未免有点大材小用。在实际业务中，策略模式也可以用来封装一系列的“业务规则”。只要业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式来封装它们。

## 普通版本的表单验证

```
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
</head>
<body>
<form action="http://xxx.com/register" id="registerForm" method="post">
	请输入用户名<input type="text" name="username"/><br />
	请输入密码<input type="text" name="password"/><br />
	请输入手机号<input type="text" name="phonenumber"/><br />
	<input type="submit" value="提交" style="padding: 10px 20px;">
</form>
<script type="text/javascript">
        var registerForm = document.getElementById('registerForm')
        
        registerForm.onsubmit = function() {
	if (registerForm.username.value === '') {
		alert('用户名不能为空')
		return false
	}
	if (registerForm.password.value.length < 6) {
		alert('密码长度不能小于6位')
		return false
	}
	if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phonenumber.value) ){
		alert('手机号码格式不正确')
		return false
	}						
}
</script>	
</body>
</html>
```


这是一种很常见的编码方式，可以看到缺点和计算奖金一摸一样

## 用策略模式重构表单验证

1.  很明显第一步我们需要将验证逻辑封装成策略对象
   

2.  接下来实现`Validator`类,负责接受用户的请求并委托给`strategies`

```
var Validator = function() {
	//保存校验规则
	this.cache = [] 
}

// 添加校验
Validator.prototype.add = function(dom, rules) {
	var self = this
	// 遍历校验规则
	for(var i = 0, rule; rule = rules[i++];) { 
		(function(rule){
			//把strategy和参数分开
			var strategyAry = rule.strategy.split(':') 	
			var errorMsg = rule.errorMsg	
			// 把校验的步骤用空函数包装起来，并且放入cache
			self.cache.push(function(){	
				// 挑选出校验规则
				var strategy = strategyAry.shift()
				// 把input的value添加进参数列表
				strategyAry.unshift(dom.value)		
				// 把errorMsg添加进参数列表
				strategyAry.push(errorMsg)			
				return strategies[strategy].apply(dom, strategyAry)
			})
		})(rule)
	}
}

// 启动校验
Validator.prototype.start = function() {
	for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) { 
		// 开始校验，并取得校验后的结果
		var errorMsg = validatorFunc() 
		if (errorMsg) {
			return errorMsg
		}
	}
}

```

3.  接下来就是调用了

```
var registerForm = document.getElementById('registerForm')

var validataFunc = function() {
	var validator = new Validator()
	validator.add(registerForm.username, [
			{
				strategy: 'isNonEmpty',
				errorMsg: '用户名不能为空'
			},
			{
				strategy: 'minLength:10',
				errorMsg: '用户名长度不能小于10位'						
			}
		]
	)
	validator.add(registerForm.password, [
			{
				strategy: 'minLength:6',
				errorMsg: '密码长度不能小于6位'						
			}
		]
	)
	validator.add(registerForm.phonenumber, [
			{
				strategy: 'isMobile',
				errorMsg: '手机号码格式不正确'						
			}
		]
	)								
	var errorMsg = validator.start()
    return errorMsg							
}

var sub = document.querySelector('input[type="submit"]')
sub.onclick = function() {
	var errorMsg = validataFunc()
	if (errorMsg) {
		console.error(errorMsg)
		return false
	}
}
```


使用策略模式重构代码之后，我们不仅通过“配置”的方式就可以完成一个表单的校验，这些规则也可以复用在程序的任何地方，还能以插件的形式，方便地移植到其他项目中。并且新增或者修改规则也是毫不费力的。

# 策略模式的优缺点

## 优点

1.  策略模式利用组合，委托和多态等技术思想，可以有效避免多重条件选择语句。
2.  策略模式提供了对开放-封闭原则的完美支持。将算法封装在独立的strategy中，使得它们易于切换，易于理解，易于扩展。
3.  策略模式中的算法也可以复用在系统中的其他地方。
4.  在策略模式中利用组合和委托让Content拥有执行算法的能力，这也是继承的一种更轻便的替代方案。

## 缺点

1.  使用策略对象会增加很多策略类或者策略对象，但实际上比把这些逻辑放在Content更好。
2.  策略模式会向用户暴露所有实现细节，这其实是违反最少知识原则。
</div>