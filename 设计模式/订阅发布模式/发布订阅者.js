
//主题对象
let subject = (function(){

    //订阅者容器
    let observe = {}; 
    //添加订阅者
    let add = function(eventName, fn){
        if(observe.hasOwnProperty(eventName)){
            observe[eventName].push({fn, args: [].slice.call(arguments, 2)})
        }else{
            observe[eventName] = [{fn, args: [].slice.call(arguments, 2)}]
        }
    }
    //删除订阅者
    let del = function(eventName, fn){
        if(observe.hasOwnProperty(eventName)){
            for(let i=0; i<observe[eventName]['length']; i++){
                if(observe[eventName][i]['fn'] === fn){
                    observe[eventName].splice(i, 1);
                }
            }
            return true;
        }
        return false;
    }
    //发布主题
    let pub = function(eventName, e){
        if(observe[eventName]){
            for(let i=0; i<observe[eventName]['length']; i++){
                observe[eventName][i]['fn'].apply(observe[eventName][i], [e, ...observe[eventName][i]['args']]);
            }
        }
    }

    return {add, del, pub}

})();

//小明订阅1号房通知
subject.add('xiaoming', function(e, roomNo){
    console.log(`小明收到通知:${roomNo}出售`)
}, '1号房');

//小红订阅2号3号房通知
subject.add('xiaohong', function(e, roomNo){
    console.log(`小红收到通知:${roomNo}出售`)
}, '2号房')

subject.add('xiaohong', function(e, roomNo){   
    if(e){
        console.log(e)
    }else{
        console.log(`小红收到通知:${roomNo}出售`);
    }
}, '3号房')

//房屋出售通知小明
subject.pub('xiaoming');
//房屋出售通知小红
subject.pub('xiaohong', '很抱歉，3号房已经被抢走');