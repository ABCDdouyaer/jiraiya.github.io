> 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问

#### 假设当 A 在心情好的时候收到花，小明表白成功的几率有 60%，而当 A 在心情差的时候收到花，小明表白的成功率无限趋近于 0。小明跟 A 刚刚认识两天，还无法辨别 A 什么时候心情好。如果不合时宜地把花送给 A，花 被直接扔掉的可能性很大，这束花可是小明吃了 7 天泡面换来的。但是 A 的朋友 B 却很了解 A，所以小明只管把钱交给 B，B 会监听 A 的心情变化，然后选 择 A 心情好的时候用小明给的钱买花转交给 A

#### 代码实现

```
var Flower = function(){};
var xiaoming = {
    sendInfor: function( target){
        target.receiveInfor(); 
    }
};
var B = {
    receiveInfor: function(){
        A.emitGoodMood(function(){ 
            var flower = new Flower();
            A.receiveFlower( flower );
        }); 
    }
};
var A = {
    receiveFlower: function( flower ){
        console.log( '收到花 ' + flower ); 
    },
    emitGoodMood: function( fn ){
        setTimeout(function(){ // 假设 5 秒之后 A 的心情变好
            fn(); 
        }, 5000 );
    } 
};
xiaoming.sendInfor( B );
```

#### 由上面的例子可以引出两种代理模式

- **保护代理**

代理 B 可以帮助 A 过滤掉一些请求，比如送花的人中年龄太大的或者没有宝马的，这种请求就可以直接在代理 B 处被拒绝掉

- **虚拟代理**

假设现实中的花价格不菲，买了直接给B花放时间长了坏掉了（导致在程序世界里，new Flower 也是一个代价昂贵的操作）， 那么我们可以把 new Flower 的操作交给代理 B 去执行（只有在检测到A的心情好的时候买个新鲜的花），代理 B 会选择在 A 心情好时再执行 new Flower

#### 保护代理应用场景

- **虚拟代理实现图片预加载**

```
let creatImgNode = (function(){
          let imgNode = document.createElement('img');
          document.body.appendChild(imgNode);
          return {
              setEnsureSrc: function(src){
                  imgNode.src = src;
              }
          }
      })();

      let proxyImage = (function(){
          let imgNode = document.getElementsByTagName('img')[0];
          imgNode.onload = function(){
              creatImgNode.setEnsureSrc(this.src);
          }
          return {
              setLoadingSrc: function(src){
                  creatImgNode.setEnsureSrc('./load.png');
                  imgNode.src = src;
              }
          }
          
      })()

    proxyImage.setLoadingSrc('https://s0.renrendai.com/cms/5864b0d6a24d131067ef7956/wangqiushi/banner/0124-JX-PCLB.jpg');
```

- **虚拟代理合并HTTP请求**

假设我们在做一个文件同步的功能，当我们选中一个 checkbox 的时候，它对应的文件就会被同 步到另外一台备用服务器上面。当一次选中过多时，会产生频繁的网络请求。将带来很大的开销。可以通过一个代理函数 proxySynchronousFile 来收集一段时间之内的请求， 最后一次性发送给服务器
