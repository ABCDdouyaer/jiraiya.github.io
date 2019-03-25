> 所谓的工厂模式，顾名思义就是成批量地生产模式。它的核心作用也是和现实中的工厂一样利用重复的代码最大化地产生效益。在javascript中，它常常用来生产许许多多相同的实例对象，在代码上做到最大的利用。工厂模式定义创建对象的接口，但是让子类决定实例化哪个类。工厂方法将类的实例化延迟到子类

#### 首先是创建构造函数，区别物种的不同属性。

```
//定义人的构造函数
var man = function(o) {
    this.foots = o.foot || 2;
    this.legs = o.legs || 2;
}

//定义鱼的构造函数
var fish = function(o) {
    this.qi = o.qi || 4;
    this.foots = o.foots || 9;
}

//定义外星人的构造函数
var et = function(o) {
    this.legs = o.legs ||10;
    this.eyes = o.eyes || 6;
}
```

#### 接下来我们再创建一个工厂的构造函数：

```
//工厂函数的构造函数
var F = function() {}
```

#### 接着在原型上设置它的默认方法：

```
//f的默认输出实例函数；
F.prototype.vehicleClass = man;
```

#### 此时，该工厂函数默认生产的是man的实例，在不配置的情况下我们产生的是人类的实例，然后我们对vehicleClass这个函数进行扩充，生成一个新的函数，此函数可以对不同的类别进行甄别，

```
//类的甄别函数
F.prototype.vehicleCreate = function(o) {
    switch(o.vehicleType) {
        case 'man' :
            this.vehicleClass = man;
            break;
        case 'fish' :
            this.vehicleClass = fish;
            break;
        case 'et' :
            this.vehicleClass = et;
            break;
        }
    //返回实例
    return this.vehicleClass(o);
}
```

#### 通过swith语句的索引，可以通过vehicleType进行不同类的实例化。那么我们看看这个类是如何工作的。首先时实例工厂类.

```
var Factory = new F();
```

#### 然后调用vehicleCreate方法，通过传参获取不同实例的对象。

```
var Man = Factory.vehicleCreate({
    vehicleType : 'man',
    legs : 2,
    foots : 2
});
```

#### 这样，通过vehicleType的值，我们可以告诉工厂类我们希望输出的物种，然后通过其他的属性，我们可以控制该物种实例的各种基础属性。

#### 工厂模式适用于以下场景：

- 实例对象较复杂。
- 多对象的简单，快速的实现。
- 跟享元模类似，适用于拥有共同属性的对象。
- 只需要满足一个API契约的其他对象的实例对象。

#### 工厂模式实现起来较为简单，不仅仅是工厂模式，几乎所有模式的代码看起来都比较简单。设计模式其实就是把经常用到的代码归纳总结系统的表达而已。在之后的应用中，我们可以系统地去想到这些模式并且运用它们。设计模式更代表的是一种系统思想，而不是重复的代码堆砌。
