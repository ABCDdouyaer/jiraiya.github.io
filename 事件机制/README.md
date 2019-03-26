[github地址：https://github.com/ABCDdouyaer/a_article_per_day/tree/master/0001](https://github.com/ABCDdouyaer/a_article_per_day/tree/master/0001)

### 线程与进程

关于线程与进程的关系可以用下面的图进行说明：
![31C6FDC64CD4EBCCC729BDD639AA787A](https://user-images.githubusercontent.com/31639964/54896393-f3c5d880-4efe-11e9-9763-37272baea9c9.png)

* 进程好比图中的工厂，有单独的专属自己的工厂资源。
* 线程好比图中的工人，多个工人在一个工厂中协作工作，工厂与工人是 `1:n`的关系。
* 多个工厂之间独立存在。

而官方的说法是：

* 进程是 `CPU`资源分配的最小单位。
* 线程是 `CPU`调度的最小单位。

从更直观的例子来看，可以打开任务管理器查看，第一个 `tab`便是进程列表，每一个进程占有的 `CPU`资源和内存资源的比例很直观的展示出来。
![8249E701E78BCC5561B70AE91006BDBA](https://user-images.githubusercontent.com/31639964/54897892-3d192680-4f05-11e9-8805-881220bcd9aa.png)

### 为什么js是单线程

初学计算机语言的时候，无论是 `C、C++`还是 `JAVA`，都是支持多线程，偏偏 `JavaScript`是单线程，不支持多线程，这也跟 `JavaScript`的作用有关，都知道 `JavaScript`是主要运行在浏览器的脚本语言，最终操作的是页面的 `DOM`结构，当两个 `JavaScript`脚本同时修改页面的同一个 `DOM`节点时，浏览器该执行哪个呢？所以当时设计 `JavaScript`时，便要求当前修改操作完成后方可进行下一步修改操作。

### 浏览器是支持多进程

同样我们打开浏览器的任务管理器，以下图为例：

![505C68C01D425DF59B2B76A426230A6D](https://user-images.githubusercontent.com/31639964/54897917-50c48d00-4f05-11e9-8459-671b8db381eb.png)

浏览器的每一个 `tab`页都是一个进程，有对应的内存占用空间、 `CPU`使用量以及进程ID。 新打开一个 `tab`页时，都会新建一个进程，所以就有一个 `tab`页对应一个进程的说法，但是这种说法又是错误的，因为浏览器有自己的优化机制，当我们打开多个空白的 `tab`页时，浏览器会将这多个空白页的进程合并为一个，从而减少了进程的数量个数。

### 浏览器内核

浏览器内核中有多个进程在同步工作，今天涉及到的浏览器的进程主要包括以下进程：

* Browser 进程

> 主进程，主要负责页面管理以及管理其他进程的创建和销毁等，常驻的线程有：
> 
> * GUI渲染线程
> * JS引擎线程
> * 事件触发线程
> * 定时器触发线程
> * HTTP请求线程
> 
> **GUI渲染线程**
> 
> * 主要负责页面的渲染，解析HTML、CSS，构建DOM树，布局和绘制等。
> * 当界面需要重绘或者由于某种操作引发回流时，将执行该线程。
> * 该线程与JS引擎线程互斥，当执行JS引擎线程时，GUI渲染会被挂起，当任务队列空闲时，JS引擎才会去执行GUI渲染。
> 
> **JS引擎线程**
> 
> * 该线程当然是主要负责处理 `JavaScript`脚本，执行代码。
> * 也是主要负责执行准备好待执行的事件，即定时器计数结束，或者异步请求成功并正确返回时，将依次进入任务队列，等待 `JS引擎线程`的执行。
> * 当然，该线程与 `GUI渲染线程`互斥，当 `JS引擎线程`执行 `JavaScript`脚本时间过长，将导致页面渲染的阻塞。
> 
> **事件触发线程**
> 
> * 主要负责将准备好的事件交给 `JS引擎线程`执行。
> * 比如 `setTimeout`定时器计数结束， `ajax`等异步请求成功并触发回调函数，或者用户触发点击事件时，该线程会将整装待发的事件依次加入到任务队列的队尾，等待 `JS引擎线程`的执行。
> 
> **定时器触发线程**
> 
> * 顾名思义，负责执行异步定时器一类的函数的线程，如： `setTimeout，setInterval`。
> * 主线程依次执行代码时，遇到定时器，会将定时器交给该线程处理，当计数完毕后，事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待JS引擎线程执行。
> 
> **HTTP请求线程**
> 
> * 顾名思义，负责执行异步请求一类的函数的线程，如： `Promise，anxios，ajax`等。
> * 主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理，当监听到状态码变更，如果有回调函数，事件触发线程会将回调函数加入到任务队列的尾部，等待JS引擎线程执行。
> 
> **多个线程之间配合工作，各司其职。**

* Render 进程

> 浏览器渲染进程（浏览器内核），主要负责页面的渲染、JS执行以及事件的循环。

### 同步任务和异步任务

* **同步任务** 即可以立即执行的任务，例如 `console.log()` 打印一条日志、声明一个变量或者执行一次加法操作等。
* **异步任务** 相反不会立即执行的事件任务。**异步任务**包括**宏任务**和**微任务**(后面会进行解释~)。
* 常见的异步操作：
  * Ajax
  * DOM的事件操作
  * setTimeout
  * Promise的then方法
  * Node的读取文件

下图给出了同步任务与异步任务的执行流程：

![31C6FDC64CD4EBCCC729BDD639AA787A](https://user-images.githubusercontent.com/31639964/54897936-633ec680-4f05-11e9-9752-6ee2ef16581f.png)

* **栈** 就像是一个容器，任务都是在栈中执行。
* **主线程** 就像是操作员，负责执行栈中的任务。
* **任务队列** 就像是等待被加工的物品。
* 异步任务完成注册后会将回调函数加入任务队列等待主线程执行。
* 执行栈中的同步任务执行完毕后，会查看并读取任务队列中的事件函数，于是任务队列的函数结束等待状态，进入执行栈，开始执行。

那么任务到底是如何入栈和出栈的呢？可以用一小段代码进行解释。

### 入栈与出栈

以下面的代码为例：

```
    console.log(1);
    function fn1(){
        console.log(2);
    }
    function fn2(){
        console.log(3);
        fn1();
    }
    setTimeout(function(){
        console.log(4);
    }, 2000);
    fn2();
    console.log(5);
```
![F13530223917097C8BFF6AE0D4CCED93](https://user-images.githubusercontent.com/31639964/54897957-72be0f80-4f05-11e9-9bfb-ad457db090ba.png)

所以上面代码运行的结果为：1,3,2,5,4。

### 宏任务和微任务

异步任务分为宏任务和微任务，宏任务队列可以有多个，微任务队列只有一个。

**宏任务和微任务的执行方式在浏览器和 `Node` 中有差异。**

#### 宏任务（macrotask）

> `script`(全局任务)， `setTimeout`， `setInterval`， `setImmediate`， `I/O`， `UI rendering`

#### 微任务（macrotask）

> `process.nextTick`， `Promise.then()`， `Object.observe`， `MutationObserver`

**在微任务中 process.nextTick 优先级高于Promise**

当一个异步任务入栈时，主线程判断该任务为异步任务，并把该任务交给异步处理模块处理，当异步处理模块处理完打到触发条件时，根据任务的类型，将回调函数压入任务队列。

* 如果是宏任务，则新增一个宏任务队列，任务队列中的宏任务可以有多个来源。
* 如果是微任务，则直接压入微任务队列。

所以上图的任务队列可以继续细化一下：
![94469869C035A45A113B17A10D2BECD4](https://user-images.githubusercontent.com/31639964/54897982-849fb280-4f05-11e9-835f-0ff1a98cde79.png)

那么当栈为空时，宏任务和微任务的执行机制又是什么呢？

### Event Loop

到这里，除了上面的问题，我们已经把事件循环的最基本的处理方式搞清楚了，但具体到异步任务中的宏任务和微任务，还没有弄明白。我们可以先顺一遍执行机制：

* 从全局任务 `script`开始，任务依次进入栈中，被主线程执行，执行完后出栈。
* 遇到异步任务，交给异步处理模块处理，对应的异步处理线程处理异步任务需要的操作，例如定时器的计数和异步请求监听状态的变更。
* 当异步任务达到可执行状态时，事件触发线程将回调函数加入任务队列，等待栈为空时，依次进入栈中执行。

到这问题就来了，当异步任务进入栈执行时，是宏任务还是微任务呢？

* 由于执行代码入口都是全局任务 `script`，而全局任务属于宏任务，所以当栈为空，同步任务任务执行完毕时，会先执行微任务队列里的任务。
* 微任务队列里的任务全部执行完毕后，会读取宏任务队列中拍最前的任务。
* 执行宏任务的过程中，遇到微任务，依次加入微任务队列。
* 栈空后，再次读取微任务队列里的任务，依次类推。

### 实例解析

回到最开始的那段代码，现在我们可以一步一步的看一下执行顺序。

```
console.log(1);
setTimeout(function(){
    console.log(2);
}, 0);
setTimeout(function(){
    console.log(3)
},2000)
console.log(4);
```

* 从全局任务入口，首先打印日志 `1`，
* 遇到宏任务 `setTimeout`，交给异步处理模块，我们暂且先记为 `setTimeout1`，
* 再次遇到宏任务 `setTimeout`，交给异步处理模块，我们暂且先记为 `setTimeout2`，
* 顺序执行，打印日志 `4`，
* 此时同步任务已执行完毕，读取宏任务队列的任务，先执行 `setTimeout1`的回调函数，因为定时器的等待时间为 `0`秒，所以会直接输出 `2`，但是 `W3C`在 `HTML`标准中规定，规定要求 `setTimeout`中低于 `4ms`的时间间隔算为 `4ms`，
* 由于浏览器在执行以上三步时，并未耗时很久，所以当宏任务 `setTimeout1`执行完时， `setTimeout2`的等待时间并未结束，所以在 `2秒`后打印日志 `3`，实际上并未等待2秒。

下面我们可以再看一个实例：

```
    setTimeout(function(){
        console.log(1);
        Promise.resolve().then(function(){
            console.log(2)
        })
    },0)

    setTimeout(function(){
        console.log(3)
    },0)
    Promise.resolve().then(function(){
        console.log(4)
    });
    console.log(5)
```    

当代码中遇到了异步请求的事件，又该如何执行，根据上面总结的执行机制，又该得到什么样的结果？

**第一轮循环**

* 同样从全局任务入口，遇到宏任务 `setTimeout`，交给异步处理模块，我们暂且先记为 `setTimeout1`，由于等待时间为 `0`，直接加入宏任务队列。
* 再次遇到宏任务 `setTimeout`，交给异步处理模块，我们暂且先记为 `setTimeout2`，同样直接加入宏任务队列。
* 遇到微任务 `then()`，加入微任务队列。
* 最后遇到打印语句，直接打印日志 `5`。

第一轮循环结束后，可以画出下图：
![E82D5BE91EAB4C4E46D75B194BC70045](https://user-images.githubusercontent.com/31639964/54898008-95e8bf00-4f05-11e9-9571-e72925ff2d77.png)

**第二轮循环**

* 栈空后，先执行微任务队列中的 `then()`方法，输出 `4`，此时微任务队列为空。
![F13530223917097C8BFF6AE0D4CCED93](https://user-images.githubusercontent.com/31639964/54898034-a1d48100-4f05-11e9-8505-dcf0b218a777.png)


* 读取宏任务队列的最靠前的任务 `setTimeout1`。
* 先直接执行打印语句，打印日志 `1`，又遇到微任务 `then()`，加入微任务队列。第二轮循环结束。
![7FA6C569C5D93A3A1B7E3770980204F7](https://user-images.githubusercontent.com/31639964/54898041-ab5de900-4f05-11e9-934f-8f7f8c52fe2b.png)

**第三轮循环**

* 先执行微任务队列中的 `then()`方法，输出 `2`，此时微任务队列为空。
![AB5C94150D3FCB46FA2887E1FAD8A56E](https://user-images.githubusercontent.com/31639964/54898066-b7e24180-4f05-11e9-9f83-8a17d195b292.png)

* 继续读取宏任务队列的最靠前的任务 `setTimeout2`。
* 直接执行打印语句，打印日志 `3`。第三轮循环结束，执行完毕。

![4FCDFD0F0B71E528CDC40B14A3648856](https://user-images.githubusercontent.com/31639964/54898074-c0d31300-4f05-11e9-8354-3000e6152fc2.png)

最后我们是我们的boss，欢迎大家在评论区留言写出自己心中的那个正确答案。

```
console.log(1);

setTimeout(function(){
    console.log(2);
    new Promise(function(resolve, reject){
        console.log(3);
        resolve();
    }).then(function(){
        console.log(4);
    })
})

new Promise(function(resolve, reject){
    console.log(5);
    resolve();
}).then(function(){
    console.log(6);
})

setTimeout(function(){
    console.log(7)
})

setTimeout(function(){
    console.log(8);
    new Promise(function(resolve, reject){
        console.log(9);
        resolve();
    }).then(function(){
        console.log(10);
    })
})

new Promise(function(resolve){
    console.log(11);
    resolve();
}).then(function(){
    console.log(12)
})

console.log(13)
```


[原文链接：https://mp.weixin.qq.com/s/9_hZX_xWSr3Gd1X_2_WOsA](https://mp.weixin.qq.com/s/9_hZX_xWSr3Gd1X_2_WOsA)

