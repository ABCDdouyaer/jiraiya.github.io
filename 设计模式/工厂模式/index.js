var car  = function(o){
    this.size = o.size;
    this.method = o.method;
}

var boat = function(o){
    this.size = o.size;
    this.method = o.method;
}

var subway = function(o){
    this.size = o.size;
    this.method = o.method;
}

var transportation = function(){};

transportation.prototype.create = function(o){
    var transport;
    switch(o.type){
        case 'car':
        transport = new car(o);
        break;
        case 'boat':
        transport = new boat(o);
        break;
        case 'subway':
        transport = new subway(o);
        break;
    }
    return transport;
}

var obj1 = new transportation().create({type: 'car', size: 'small', method: 'road'});

console.log(obj1);