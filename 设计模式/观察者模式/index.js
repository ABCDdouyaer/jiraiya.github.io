//主题对象
function Subject(){
    this.observers = [];//收集订阅者
}

//主题对象的方法
Subject.prototype = {
    add: function(observer){
        this.observers.push(observer)
    },

    remove: function(observer){
       var observers = this.observers;
       for(var i=0; i< observers.length; i++){
           if(observers[i] === observer){
               observers.splice(i, 1);
           }
       }
    },

    notify: function(){
        var observers = this.observers;
        observers.forEach(e => {
            e.update()
        });
    }
}

//观察者
function Observer(name){
    this.name = name;
}

//观察者的方法
Observer.prototype = {
    update: function(){
        console.log('my name is ' + this.name)
    }
}

var observer1 = new Observer('Mr Wang');
var observer2 = new Observer('Miss Du');

var subject = new Subject();
subject.add(observer1);
subject.add(observer2);
subject.notify();