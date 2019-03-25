> 迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来,在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

```


function Iterator(arr){
   var index = 0;
   var value = null, done = false;
   var next = function(){
       index >= arr.length ? done = true : done = false;
       value = arr[index];
       return{
           done,
           value,
           index: index++
       }
   }

   return {
       next
   }
}

let result = Iterator(['a', 'b', 'c']);
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
```