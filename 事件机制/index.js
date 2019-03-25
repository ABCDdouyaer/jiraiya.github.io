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


// 1 5 11 13  6 12 2 3 7 8 9 4 10