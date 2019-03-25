const fs = require('fs');

const files = fs.readdirSync('./事件机制/resources');


let files1 = files.filter(e => {
    return !e.endsWith('.png')
})
files1.map(e =>{
    fs.renameSync('./事件机制/resources/'+e,'./事件机制/resources/'+e+'.png' )
})