> 适配器模式的作用是解决两个软件实体间的接口不兼容的问题。使用适配器模式之后，原本 由于接口不兼容而不能工作的两个软件实体可以一起工作。适配器的别名是包装器(wrapper)，这是一个相对简单的模式。在程序开发中有许多这样的 场景:当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前的需求。 这时候有两种解决办法，第一种是修改原来的接口实现，但如果原来的模块很复杂，或者我们拿 到的模块是一段别人编写的经过压缩的代码，修改原接口就显得不太现实了。第二种办法是创建 一个适配器，将原接口转换为客户希望的另一个接口，客户只需要和适配器打交道。

**故事背景**

现在使用谷歌地图和百度地图在页面展现地图

```
var googleMap = { 
    show: function(){
        console.log( '开始渲染谷歌地图' ); 
    }
};
var baiduMap = { 
    show: function(){
        console.log( '开始渲染百度地图' ); 
    }
};
var renderMap = function( map ){
    if ( map.show instanceof Function ){
        map.show(); 
    }
};
renderMap( googleMap ); // 输出:开始渲染谷歌地图
renderMap( baiduMap ); // 输出:开始渲染百度地图
```

**问题假设**

这段程序得以顺利运行的关键是 googleMap 和 baiduMap 提供了一致的 show 方法，但第三方的 接口方法并不在我们自己的控制范围之内，假如 baiduMap 提供的显示地图的方法不叫 show 而叫 display 呢
baiduMap 这个对象来源于第三方，正常情况下我们都不应该去改动它。此时我们可以通过增 加 baiduMapAdapter 来解决问题

```
var googleMap = { 
    show: function(){
        console.log( '开始渲染谷歌地图' ); 
    }
};
var baiduMap = {
    display: function(){
        console.log( '开始渲染百度地图' ); 
    }
};
var baiduMapAdapter = { 
    show: function(){
        return baiduMap.display();
    } 
};
renderMap( googleMap ); // 输出:开始渲染谷歌地图
renderMap( baiduMapAdapter ); // 输出:开始渲染百度地图
```

**总结**

- 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实 现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够 使它们协同作用。
  
- 装饰者模式和代理模式也不会改变原有对象的接口，但装饰者模式的作用是为了给对象 增加功能。装饰者模式常常形成一条长的装饰链，而适配器模式通常只包装一次。代理 模式是为了控制对对象的访问，通常也只包装一次。
  
- 外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外 观模式最显著的特点是定义了一个新的接口。
