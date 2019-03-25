> 组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。 除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性

以命令模式中的宏命令代码为例，宏命令对象包含了一组具体的子命令对象，不管是宏命令对象，还是子命令对象，都有一个execute方法负责执行命令。宏命令中包含了一组子命令，它们组成了一个树形结构，这里是一棵结构非常简单的树

![](source/167b6de69897adf8)

在组合模式中，请求在树中传递的过程总是遵循一种逻辑。请求从树最顶端的对象往下传递，如果当前处理请求的对象是叶对象(普通子命令)，叶对象自身会对请求作出相应的处理;如果当前处理请求的对象是组合对象(宏命令)， 组合对象则会遍历它属下的子节点，将请求继续传递给这些子节点。

![](source/167b6de69881f746)


- **组合模式下的宏命令** 目前的万能遥控器，包含了关门、开电脑、登录 QQ 这 3 个命令。现在我们需要一个“超级万能遥控器”，可以控制家里所有的电器，这个遥控器拥有以下功能
    - 打开空调
    - 打开电视和音响
    - 关门、开电脑、登录 QQ

```
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
var openAcCommand = { 
    execute: function(){
        console.log( '打开空调' ); 
    }
};
/*家里的电视和音响是连接在一起的，所以可以用一个宏命令来组合打开电视和打开音响的命令*/
var openTvCommand = { 
    execute: function(){
        console.log( '打开电视' ); 
    }
};
var openSoundCommand = { 
    execute: function(){
        console.log( '打开音响' );  
    }
};
var macroCommand1 = MacroCommand(); 
macroCommand1.add(openTvCommand); 
macroCommand1.add(openSoundCommand);
/*关门、打开电脑和打登录 QQ 的命令*/
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
var macroCommand2 = MacroCommand(); 
macroCommand2.add( closeDoorCommand ); 
macroCommand2.add( openPcCommand ); 
macroCommand2.add( openQQCommand );

/*现在把所有的命令组合成一个“超级命令”*/
var macroCommand = MacroCommand(); 
macroCommand.add( openAcCommand ); 
macroCommand.add( macroCommand1 ); 
macroCommand.add( macroCommand2 );

/*最后给遥控器绑定“超级命令”*/
var setCommand = (function( command ){ 
    document.getElementById( 'button' ).onclick = function(){
        command.execute(); 
    }
})( macroCommand );
```

从这个例子中可以看到，基本对象可以被组合成更复杂的组合对象，组合对象又可以被组合， 这样不断递归下去，这棵树的结构可以支持任意多的复杂度。在树最终被构造完成之后，让整颗 树最终运转起来的步骤非常简单，只需要调用最上层对象的 execute 方法。每当对最上层的对象 进行一次请求时，实际上是在对整个树进行深度优先的搜索，而创建组合对象的程序员并不关心这些内在的细节，往这棵树里面添加一些新的节点对象是非常容易的事情。

**应用场景 —— 扫描文件夹**

文件夹和文件之间的关系，非常适合用组合模式来描述。文件夹里既可以包含文件，又可以 包含其他文件夹，最终可能组合成一棵树
当使用用杀毒软件扫描该文件夹时，往往不会关心里面有多少文件和子文件夹，组合模式使得我们只需要操作最外层的文件夹进行扫描。

```
/* Folder */ 
var Folder = function( name ){
    this.name = name;
    this.files = []; 
};
Folder.prototype.add= function( file ){ 
    this.files.push(file );
};
Folder.prototype.scan = function(){
    console.log( '开始扫描文件夹: ' + this.name );
    for ( var i = 0, file, files = this.files; file = files[ i++ ]; ){
        file.scan();
    } 
};
/*File*/
var File = function( name ){
    this.name = name; 
};
File.prototype.add = function(){
    throw new Error( '文件下面不能再添加文件' );
};
File.prototype.scan = function(){
    console.log( '开始扫描文件: ' + this.name );
};
/*创建一些文件夹和文件对象， 并且让它们组合成一棵树，这棵树就是我们 F 盘里的 现有文件目录结构*/
var folder = new Folder( '学习资料' ); 
var folder1 = new Folder( 'JavaScript' ); 
var folder2 = new Folder ( 'jQuery' );
var file1 = new File( 'JavaScript 设计模式与开发实践' );
var file2 = new File( '精通 jQuery' );
var file3 = new File('重构与模式' );
folder1.add( file1 ); 
folder2.add( file2 );
folder.add( folder1 ); 
folder.add( folder2 ); 
folder.add( file3 );

/*现在的需求是把移动硬盘里的文件和文件夹都复制到这棵树中，假设我们已经得到了这些文件对象*/
var folder3 = new Folder( 'Nodejs' );
var file4 = new File( '深入浅出 Node.js' ); 
folder3.add( file4 );
var file5 = new File( 'JavaScript 语言精髓与编程实践' );

/*接下来就是把这些文件都添加到原有的树中*/
folder.add( folder3 ); 
folder.add( file5 );

```

**小结**

组合模式可以让我们使用树形方式创 建对象的结构。我们可以把相同的操作应用在组合对象和单个对象上。在大多数情况下，我们都 可以忽略掉组合对象和单个对象之间的差别，从而用一致的方式来处理它们。
然而，组合模式并不是完美的,它可能会产生一个这样的系统:系统中的每个对象看起来都 与其他对象差不多。它们的区别只有在运行的时候会才会显现出来,这会使代码难以理解。此外,如果通过组合模式创建了太多的对象，那么这些对象可能会让系统负担不起。
