let pubSub = {
    list:{},

    subscribe:function(key, fn){//订阅
        if(!this.list[key]){
            this.list[key] = []
        }
        this.list[key].push(fn);
    },

    publish:function(){//发布
        let arg = arguments;
        let key = [].shift.call(arg);
        let fns = this.list[key];
        if(!fns || fns.length<=0) return false;
        for(var i=0; i<fns.length; i++){
            fns[i].apply(this, arg);
        }
    },

    unSubscribe(key){//取消订阅
        delete this.list[key];
    }
}

pubSub.subscribe('name',(name)=>{console.log('your name is ' + name)});
pubSub.subscribe('sex',(sex)=>{console.log('your sex is ' + sex)});

pubSub.publish('name', 'Mr Wang');
pubSub.publish('sex', 'man');