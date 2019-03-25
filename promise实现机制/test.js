const Promise = require('./promise');

let a = new Promise((resolve, reject)=>{
    setTimeout(function(){resolve(444)},3000)
}).then((e)=>{
    console.log(e)
},(err)=>{
    console.log(1111)
    console.log(err)
    console.log(1111)
})