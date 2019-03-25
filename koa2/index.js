
let middleware = [
    function(ctx, next){
      console.log(1);
      next();
      console.log(2);
},
function(ctx, next){
    console.log(3);
    next();
    console.log(4);
    next();
    console.log(5);
},
function(ctx, next){
    console.log(6);
    next();
    console.log(7)
}
]


function f(context, next){
   let index = -1;
   function dispatch(i){
    if (i <= index) return Promise.reject(new Error('next() called multiple times'))
       index = i;
       let fn = middleware[i];
       if(i === middleware.length) fn = next;
       if(!fn) return Promise.resolve();
       return fn(context, function next(){
           return dispatch(i+1);
       })
   }
   return dispatch(0);
}

f()