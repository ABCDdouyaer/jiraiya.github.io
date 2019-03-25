

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