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