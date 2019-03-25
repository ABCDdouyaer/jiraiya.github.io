> 模板方法模式是一种只需使用继承就可以实现的非常简单的模式。模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

**故事背景**

我们现在需要冲泡一杯咖啡和一壶茶，它们的操作步骤基本上是一样的，如下所示

<table>
<thead>
<tr>
<th style="text-align:center">泡咖啡</th>
<th style="text-align:center">泡茶</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">把水煮沸</td>
<td style="text-align:center">把水煮沸</td>
</tr>
<tr>
<td style="text-align:center">用沸水冲泡咖啡</td>
<td style="text-align:center">用沸水浸泡茶叶</td>
</tr>
<tr>
<td style="text-align:center">把咖啡倒进杯子</td>
<td style="text-align:center">把茶水倒进杯子</td>
</tr>
<tr>
<td style="text-align:center">加糖和牛奶</td>
<td style="text-align:center">加柠檬</td>
</tr>
</tbody>
</table>

**代码实现(继承)**

```
/*创建一个抽象父类来表示泡一杯饮料的整个过程。
不论是 Coffee,还是 Tea,都被我们用Beverage来表示*/
var Beverage = function(){};
Beverage.prototype.boilWater = function(){ 
    console.log( '把水煮沸' );
};
Beverage.prototype.brew = function(){
    throw new Error( '子类必须重写 brew 方法' );
}; 
Beverage.prototype.pourInCup = function(){
    throw new Error( '子类必须重写 pourInCup 方法' );
}; 
Beverage.prototype.addCondiments = function(){
    throw new Error( '子类必须重写 addCondiments 方法' );
};
Beverage.prototype.init = function(){ 
    this.boilWater();
    this.brew();
    this.pourInCup(); 
    this.addCondiments();
};
/*创建Coffee类*/
var Coffee = function(){}; 
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function(){ 
    console.log( '用沸水冲泡咖啡' );
};
Coffee.prototype.pourInCup = function(){
    console.log( '把咖啡倒进杯子' );
};
Coffee.prototype.addCondiments = function(){ 
    console.log( '加糖和牛奶' );
};
var Coffee = new Coffee(); 
Coffee.init();
/*创建Tea 类*/
var Tea = function(){};
Tea.prototype = new Beverage();
Tea.prototype.brew = function(){ 
    console.log( '用沸水浸泡茶叶' );
};
Tea.prototype.pourInCup = function(){
    console.log( '把茶倒进杯子' );
};
Tea.prototype.addCondiments = function(){ 
    console.log( '加柠檬' );
};
var tea = new Tea(); 
tea.init();
```

**思考：真的需要继承吗?**

模板方法模式中，父类封装了子类的算法框架和方法的执行顺序，子类继承父类之后，父类通知子类执行这些方法，好莱坞原则 很好地诠释了这种设计技巧

**好莱坞原则**

好莱坞无疑是演员的天堂，但好莱坞也有很多找不到工作的新人演员，许多新人演员在好莱 坞把简历递给演艺公司之后就只有回家等待电话。有时候该演员等得不耐烦了，给演艺公司打电 话询问情况，演艺公司往往这样回答:“不要来找我，我会给你打电话。”
在设计中，这样的规则就称为好莱坞原则。在这一原则的指导下，我们允许底层组件将自己 挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件，高层组件对 待底层组件的方式，跟演艺公司对待新人演员一样，都是“别调用我们，我们会调用你”。

**代码重构(好莱坞原则)**


**总结**

```
var Beverage = function( param ){
    var boilWater = function(){ 
        console.log( '把水煮沸' );
    };
    var brew = param.brew || function(){  
        throw new Error( '必须传递 brew 方法' );
    };
    var pourInCup = param.pourInCup || function(){ 
        throw new Error( '必须传递 pourInCup 方法' );
    };
    var addCondiments = param.addCondiments || function(){ 
        throw new Error( '必须传递 addCondiments 方法' );
    };
    var F = function(){};
    F.prototype.init = function(){ 
        boilWater();
        brew();
        pourInCup();  
        addCondiments();
     };
    return F; 
};
var Coffee = Beverage({ 
    brew: function(){
        console.log( '用沸水冲泡咖啡' ); 
    },
    pourInCup: function(){
        console.log( '把咖啡倒进杯子' );
   },
   addCondiments: function(){
        console.log( '加糖和牛奶' ); 
    }
});
var Tea = Beverage({
    brew: function(){
        console.log( '用沸水浸泡茶叶' ); 
    },
    pourInCup: function(){
        console.log( '把茶倒进杯子' );
    },
    addCondiments: function(){
       console.log( '加柠檬' ); 
    }
});
var coffee = new Coffee();
coffee.init();
var tea = new Tea(); 
tea.init();
```

模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式。在传统的面向对象语 言中，一个运用了模板方法模式的程序中，子类的方法种类和执行顺序都是不变的，所以我们把这部分逻辑抽象到父类的模板方法里面。而子类的方法具体怎么实现则是可变的，于是我们把这 部分变化的逻辑封装到子类中。通过增加新的子类，我们便能给系统增加新的功能，并不需要改动抽象父类以及其他子类，这也是符合开放封闭原则的。
