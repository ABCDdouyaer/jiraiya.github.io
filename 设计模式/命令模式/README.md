> 命令模式是最简单和优雅的模式之一，命令模式中的命令(command)指的是一个执行某些特定事情的指令。

#### 应用场景

有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。


- **菜单案例**

    假设我们正在编写一个用户界面程序，该用户界面上至少有数十个 Button 按钮。因为项目比较复杂，所以我们决定让某个程序员负责绘制这些按钮，而另外一些程序员则负责编写点击按钮后的具体行为，这些行为都将被封装在对象里。
    在大型项目开发中，这是很正常的分工。对于绘制按钮的程序员来说，他完全不知道某个按钮未来将用来做什么，可能用来刷新菜单界面，也可能用来增加一些子菜单，他只知道点击这个 按钮会发生某些事情。那么当完成这个按钮的绘制之后，应该如何给它绑定onclick 事件呢?
    我们很快可以找到在这里运用命令模式的理由:点击了按钮之后，必须向某些负责具体行为的对象发送请求，这些对象就是请求的接收者。但是目前并不知道接收者是什么对象，也不知道接收者究竟会做什么。此时我们需要借助命令对象的帮助，以便解开按钮和负责具体行为对象之间的耦合。

- **代码实现**
  
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>简易的例子</title>
</head>
<body>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <button id="btn">发送命令</button>
    <script>
       window.onload = function(){

          //接受命令者要执行的命令
          let buttonMenuCommand = function(receiver){
              return {
                  execute(){
                      for(let i=0;i<receiver.length;i++){
                        receiver[i].innerHTML = '改变了...';
                      }   
                  }
              }
          }
          
          //发送者发送命令给接受者
          let setCommand = function(button, receiverDoSomething){
              button.onclick = function(){
                 receiverDoSomething.execute();
              }
          }

           //传入接受命令者
           let innerHtmlChange = buttonMenuCommand(document.getElementsByTagName('div'));
          
          
          //发送命令
          setCommand(document.getElementById('btn'), innerHtmlChange);

       }
    </script>
</body>
</html>
```

- **撤销命令**

    命令模式的作用不仅是封装运算块，而且可以很方便地给命令对象增加撤销操作。现在页面上有个小球，点击移动按钮和撤销按钮可以实现移动和撤销的操作。

- **代码实现**

```
var MoveCommand = function( receiver, pos ){ 
   this.receiver = receiver;
   this.pos = pos;
   this.oldPos = null;
};
MoveCommand.prototype.execute = function(){
   this.receiver.start( 'left', this.pos, 1000, 'strongEaseOut' );
   this.oldPos = this.receiver.dom.getBoundingClientRect([this.receiver.propertyName ];  // 记录小球开始移动前的位置
};
MoveCommand.prototype.undo = function(){
   this.receiver.start( 'left', this.oldPos, 1000, 'strongEaseOut' ); // 回到小球移动前记录的位置
};
var moveCommand;
moveBtn.onclick = function(){
   var animate = new Animate( ball );
   moveCommand = new MoveCommand( animate, pos.value );       
   moveCommand.execute();
};
cancelBtn.onclick = function(){ 
   moveCommand.undo();
};
```

- **宏命令**
    宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。想象一下，家里有一个万能遥控器，每天回家的时候，只要按一个特别的按钮，它就会帮我们关上房间门，顺便打开电脑并登录 QQ。

- **代码实现**
  
```
var closeDoorCommand = { 
    execute: function(){
        console.log( '关门' ); 
    }
};
var openPcCommand = { 
    execute: function(){
        console.log( '开电脑' ); 
    }
};
var openQQCommand = { 
    execute: function(){
        console.log( '登录 QQ' ); 
    }
};
var MacroCommand = function(){ 
    return {
           commandsList: [],
           add: function( command ){
              this.commandsList.push( command ); 
           },
           execute: function(){
              for ( var i = 0, command; command = this.commandsList[ i++ ]; ){
                  command.execute(); 
              }
          } 
      }
};
var macroCommand = MacroCommand();

macroCommand.add( closeDoorCommand );  
macroCommand.add( openPcCommand );
macroCommand.add( openQQCommand );

macroCommand.execute();

```
