
//模拟redis本地存储

const readJson = require('read-metadata');//读取json并返回obj
const fs = require('fs');

class Redis{
    constructor(){
       this.data = readJson.sync(DATA_PATH + '/redisStore.json');
    }

    add(key, value, expire){
        this.data[key] = {
            value,
            expire
        };
        this.store();
    }

    del(key){
        if(this.data[key]){
            delete this.data[key];
            this.store();
        }
    }

    get(key){
        if(this.data[key]){
            const now = Date.now();
            const expire = this.data[key].expire;
            if(now < expire || expire ==='forever'){
                return this.data[key].value;
            }else{
                delete this.data[key];
                this.store();
            }
        }
    }

    store(){
        fs.writeFile(DATA_PATH + '/redisStore.json', JSON.stringify(this.data), (err) =>{
            if(err){
                console.log('储存redis数据失败')
            }else{
                console.log('储存redis数据成功')
            }
        })
    }
}

module.exports = new Redis();