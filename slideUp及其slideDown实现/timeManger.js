/**
 * Created by WangWei  at 2018-10-22
 * 保证需要上拉和下拉的元素高度自由 并且overflow:hiddle
 * 采用maxHeight控制高度动画是因为采用height控制高度，子元素会溢出父盒子，子元素哦内容不会随着父元素高度变化而消失
 * 采用时间管理对象的目的是为了防止连续点击而定时器发生紊乱
 */

window.Slider = (function(){
    
    let Slider = {};

    function TimerManager(){
        this.times = [];//保存所有定时器
        this.args = [];//保存所有定时器的参数
        this.isExecute = false;//当前是否有定时器再执行
    }

    //为元素添加时间管理实例
    TimerManager.makeInstance = function(el){
        if(!el.__TimerManager__ || el.__TimerManager__.constructor !== TimerManager){
            el.__TimerManager__ = new TimerManager();
        }
    }

    //为原型添加add,next,first方法
    TimerManager.prototype.add = function(time, args){
        this.times.push(time);
        this.args.push(args);
        this.first();
    }

    TimerManager.prototype.first = function(){
        if(!this.isExecute){
            let [time, arg] = [this.times.shift(), this.args.shift()];
            if(time && arg){
                this.isExecute = true;
                time(arg[0], arg[1]);
            }
        }
    }
        
    TimerManager.prototype.next = function(){
        this.isExecute = false;
        this.first();
    }

    function fnSlideDown(el, ms){
        if(el.offsetHeight === 0){
            el.style.display = 'block';
            let totalHeight = el.offsetHeight;
            el.style.maxHeight = '0px';
            let currentHeight = 0;
            let increment = totalHeight/(ms/10);
            let time = setInterval(()=>{
                currentHeight = currentHeight + increment;
                el.style.maxHeight = currentHeight + 'px';
                if(currentHeight >= totalHeight){
                    clearInterval(time);
                    el.style.maxHeight = totalHeight + 'px';
                    if(el.__TimerManager__ && el.__TimerManager__.constructor === TimerManager){
                        el.__TimerManager__.next();
                    };
                };
            },10)
        }
    }

    function fnSlideUp(el, ms){
    if(el.offsetHeight > 0){
        let totalHeight = el.offsetHeight;
        let currentHeight = totalHeight;
        let decrement = totalHeight/(ms/10);
        let time = setInterval(()=>{
            currentHeight = currentHeight - decrement;
            el.style.maxHeight = currentHeight + 'px';
            if(currentHeight <= 0){
                clearInterval(time);
                el.style.display = 'none';
                el.style.maxHeight = totalHeight + 'px';
                if(el.__TimerManager__ && el.__TimerManager__.constructor === TimerManager){
                    el.__TimerManager__.next();
                };
            };
        },10);
    }else{
        if(el.__TimerManager__ && el.__TimerManager__.constructor === TimerManager){
            el.__TimerManager__.next();
        };
    }
    }


    Slider.slideDown = function(el, ms) {
        TimerManager.makeInstance(el);
        el.__TimerManager__.add(fnSlideDown, arguments);
        return this;
    };


    Slider.slideUp = function(el, ms) {
        TimerManager.makeInstance(el);
        el.__TimerManager__.add(fnSlideUp, arguments);
        return this;
    };


    return Slider;


})();

