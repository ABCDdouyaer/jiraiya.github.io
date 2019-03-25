var each = function(ary, callback){
    for(var i=0; i<ary.length; i++){
        callback.call(ary[i], i, ary[i]);
    }
}

each(['a', 'b', 'c'], function(i, result){
    console.log(i, result)
})