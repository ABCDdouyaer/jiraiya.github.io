> 发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状 态发生改变时，所有依赖于它的对象都将得到通知。在 JavaScript 开发中，我们一般用事件模型 来替代传统的发布—订阅模式。


####故事背景

小明最近看上了一套房子，到了售楼处之后才被告知，该楼盘的房子早已售罄。好在售楼 MM 告诉小明，不久后还有一些尾盘推出，开发商正在办理相关手续，手续办好后便可以购买。 但到底是什么时候，目前还没有人能够知道。
于是小明记下了售楼处的电话，以后每天都会打电话过去询问是不是已经到了购买时间。除 了小明，还有小红、小强、小龙也会每天向售楼处咨询这个问题。一个星期过后，售楼 MM 决 定辞职，因为厌倦了每天回答 1000 个相同内容的电话。
当然现实中没有这么笨的销售公司，实际上故事是这样的:小明离开之前，把电话号码留在 了售楼处。售楼 MM 答应他，新楼盘一推出就马上发信息通知小明。小红、小强和小龙也是一 样，他们的电话号码都被记在售楼处的花名册上，新楼盘推出的时候，售楼 MM 会翻开花名册,遍历上面的电话号码,依次发送一条短信来通知他们。
发送短信通知就是一个典型的发布—订阅模式，小明、小红等购买者都是 订阅者，他们订阅了房子开售的消息。售楼处作为发布者,会在合适的时候遍历花名册上的电话号码,依次给购房者发布消息。


```

//主题对象
let subject = (function(){

    //订阅者容器
    let observe = {}; 
    //添加订阅者
    let add = function(eventName, fn){
        if(observe.hasOwnProperty(eventName)){
            observe[eventName].push({fn, args: [].slice.call(arguments, 2)})
        }else{
            observe[eventName] = [{fn, args: [].slice.call(arguments, 2)}]
        }
    }
    //删除订阅者
    let del = function(eventName, fn){
        if(observe.hasOwnProperty(eventName)){
            for(let i=0; i<observe[eventName]['length']; i++){
                if(observe[eventName][i]['fn'] === fn){
                    observe[eventName].splice(i, 1);
                }
            }
            return true;
        }
        return false;
    }
    //发布主题
    let pub = function(eventName, e){
        if(observe[eventName]){
            for(let i=0; i<observe[eventName]['length']; i++){
                observe[eventName][i]['fn'].apply(observe[eventName][i], [e, ...observe[eventName][i]['args']]);
            }
        }
    }

    return {add, del, pub}

})();

//小明订阅1号房通知
subject.add('xiaoming', function(e, roomNo){
    console.log(`小明收到通知:${roomNo}出售`)
}, '1号房');

//小红订阅2号3号房通知
subject.add('xiaohong', function(e, roomNo){
    console.log(`小红收到通知:${roomNo}出售`)
}, '2号房')

subject.add('xiaohong', function(e, roomNo){   
    if(e){
        console.log(e)
    }else{
        console.log(`小红收到通知:${roomNo}出售`);
    }
}, '3号房')

//房屋出售通知小明
subject.pub('xiaoming');
//房屋出售通知小红
subject.pub('xiaohong', '很抱歉，3号房已经被抢走');

```

当然除了自执行函数，大家也可以用构造器函数和class编写，看起来可能更加好理解；

#### 应用场景 

单例模式中的事件中心

