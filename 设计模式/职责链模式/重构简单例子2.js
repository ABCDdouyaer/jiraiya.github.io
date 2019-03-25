var order500 = function( orderType, pay, stock ){ 
    if ( orderType === 1 && pay === true ){
        return '500 元定金预购，得到 100 优惠券'; 
    } else{
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递 
    }
};
var order200 = function( orderType, pay, stock ){ 
    if ( orderType === 2 && pay === true ){
        return '200 元定金预购，得到 50 优惠券'; 
    } else{
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递 
    }
};
var orderNormal = function( orderType, pay, stock ){
    if ( stock > 0 ){ 
        return '普通购买，无优惠券'; 
    } else{
        return '手机库存不足'; 
    }
};

function Chain(){
    this.chainCache = [];
}

Chain.prototype.add = function(fn){
    this.chainCache.push(fn);
}

Chain.prototype.pass = function(orderType, pay, stock){
    let i = 0;
    let m = '';
    function next(){
        if (!this.chainCache[i]) return this;
        let result = this.chainCache[i++](orderType, pay, stock);
        if(result === 'nextSuccessor'){
            next.call(this, orderType, pay, stock)
        }else{
           m = result;
        }
    }
    next.call(this);
    return m;
}

let newChain = new Chain();
newChain.add(order500);
newChain.add(order200);
newChain.add(orderNormal);

console.log(newChain.pass( 1, true, 500 ))
console.log(newChain.pass( 2, true, 500 ))
console.log(newChain.pass( 3, true, 500 ))
console.log(newChain.pass( 1, false, 0 ))
