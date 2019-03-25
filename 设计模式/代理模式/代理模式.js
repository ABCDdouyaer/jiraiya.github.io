var Flower = function(){};
var xiaoming = {
    sendInfor: function( target){
        target.receiveInfor(); 
    }
};
var B = {
    receiveInfor: function(){
        A.emitGoodMood(function(){ 
            var flower = new Flower();
            A.receiveFlower( flower );
        }); 
    }
};
var A = {
    receiveFlower: function( flower ){
        console.log( '收到花 ' + flower ); 
    },
    emitGoodMood: function( fn ){
        setTimeout(function(){ // 假设 5 秒之后 A 的心情变好
            fn(); 
        }, 5000 );
    } 
};
xiaoming.sendInfor( B );
