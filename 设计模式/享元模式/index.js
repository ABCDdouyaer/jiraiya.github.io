//享元模式
var flyWight  = (function(window, undefined){//立即执行函数返回一个享元对象
    var Cars = {};//这里是存储器，用存储所有的car对象
    var Car = function(d) {//构造方法
        this.id = d.id;
        this.lt = d.lt;//轮胎
        this.fxp = d.fxp;//方向盘
        this.lhq = d.lhq;//离合器
        this.sc = d.sc;//刹车
        this.zw = d.zw;//座位
        this.cc = d.cc;//车窗
        this.dhy = d.dhy;//导航仪
    }
    Car.prototype.gmg = 'china';// 买家的国籍，这里适应定义一些公共属性，适用于所有车辆的公用属性，比如购买的国家，方便统一修改
    Car.prototype = {//Car的原型类方法，上面提供了操作Car实例的一些方法，可以自己定义，卤煮在此只定义最基本的方法
        set : function(n ,v) {
            this[n] = v;
        },
        get : function(n) {
            return this[v];
        }
    }
    var _factory = function(d) {//构建实例工厂，以pp（品牌）为类构建Car类别，，此方法属于私有，外部无法调用。
        if(!Cars[d.pp]) {
            Cars[d.pp] = new Car(d);
        }
        return Cars[d.pp];//返回该品牌的类别
    }

    var controlCar =  {//享元对象
        allCars : {},//另一个存储所有车辆的对象,
        addCar : function(data) {//添加一辆车
            if(this.allCars[data.id]) return this.allCars[data.id];
            this.allCars[data.id] = {
                id : data.id,
                pp : data.pp,
                ys : data.ys,
                cp : data.cp,
                buyTime : data.buyTime,
                jg : data.jg,
                car : _factory(data)
            }
        },
        removeCar : function(data) {//删除一辆车
            if(this.allCars[data.id]) {
                this.allCars[data.id] = undefined;
            }
        },
        getCar : function (id) {//获取一辆汽车
            return this.allCars[id];
        }
    }

    return controlCar;//返回享元对象
})(window, undefined);