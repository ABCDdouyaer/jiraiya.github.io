> 中介者模式的作用就是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的 相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知 中介者对象即可。中介者使各对象之间耦合松散，而且可以独立地改变它们之间的交互。中介者模式使网状的多对多关系变成了相对简单的一对多关系

**故事背景**

假如在玩泡泡堂的游戏，使用泡泡击败对方所有玩家才能获得胜利。现在将队伍分成两个组进行游戏

**代码实现(未使用中介者模式)**

```
/*玩家*/
function Player( name, teamColor ){ 
    this.partners = []; // 队友列表 
    this.enemies = []; // 敌人列表 
    this.state = 'live'; // 玩家状态 
    this.name = name; // 角色名字 
    this.teamColor = teamColor; // 队伍颜色
};
Player.prototype.win = function(){ // 玩家团队胜利 
    console.log( 'winner: ' + this.name );
};
Player.prototype.lose = function(){ // 玩家团队失败
    console.log( 'loser: ' + this.name );
};

/*玩家死亡的方法*/
Player.prototype.die = function(){ // 玩家死亡 
    var all_dead = true;
    this.state = 'dead'; // 设置玩家状态为死亡
    for ( var i = 0, partner; partner = this.partners[ i++ ]; ){ // 遍历队友列表
        if ( partner.state !== 'dead' ){ // 如果还有一个队友没有死亡，则游戏还未失败
            all_dead = false; break;
        } 
    }
    if( all_dead === true ){// 如果队友全部死亡
        this.lose(); // 通知自己游戏失败
        for ( var i = 0, partner; partner = this.partners[ i++ ]; ){
            partner.lose(); 
        }
        for ( var i = 0, enemy; enemy = this.enemies[ i++ ]; ){ 
            enemy.win();
        } 
    }
};
/*定义一个工厂来创建玩家*/
var playerFactory = function( name, teamColor ){ 
    var newPlayer = new Player( name, teamColor );
    for ( var i = 0, player; player = players[ i++ ]; ){ // 通知所有的玩家，有新角色加入 
        if ( player.teamColor === newPlayer.teamColor ){ // 如果是同一队的玩家
            player.partners.push( newPlayer ); // 相互添加到队友列表
            newPlayer.partners.push( player ); 
        } else{
            player.enemies.push( newPlayer ); // 相互添加到敌人列表
            newPlayer.enemies.push( player ); 
        }
    }
    players.push( newPlayer );
    return newPlayer; 
};
/*创建玩家*/
//红队:
var player1 = playerFactory( '皮蛋', 'red' ),
    player2 = playerFactory( '小乖', 'red' ), 
    player3 = playerFactory( '宝宝', 'red' ), 
    player4 = playerFactory( '小强', 'red' );
//蓝队:
var player5 = playerFactory( '黑妞', 'blue' ),
    player6 = playerFactory( '葱头', 'blue' ), 
    player7 = playerFactory( '胖墩', 'blue' ), 
    player8 = playerFactory( '海盗', 'blue' );

让红队玩家全部死亡:
player1.die(); 
player2.die();
player4.die();  
player3.die();
```

![](resource/167d8a241604adab)

**重构思路**

如果玩家不止8个，有成百上千个。一个玩家如果掉线或者更换队伍，上面的代码完全无法解决。所以需要一个中间对象去管理每个玩家之间的状态与关系。如下图所示

![](resource/167d8a24162092f2)

**代码重构(使用中介者模式)**

步骤

    - 定义Player构造函数和player对象的原型方法
    - 定义中介者对象playerDirector
    - 把操作转交给中介者对象


```
/*******************玩家死亡*****************/
Player.prototype.die = function(){
    this.state = 'dead';
    playerDirector.reciveMessage( 'playerDead', this );// 给中介者发送消息，玩家死亡
};
/*******************移除玩家*****************/
Player.prototype.remove = function(){ // 给中介者发送消息，移除一个玩家
    playerDirector.reciveMessage('removePlayer', this );
};
/*******************玩家换队*****************/
Player.prototype.changeTeam = function( color ){
    playerDirector.reciveMessage( 'changeTeam', this, color ); // 给中介者发送消息，玩家换队
};
/*******************定义中介者对象*****************/
var playerDirector= ( function(){
    var players = {}, // 保存所有玩家
    operations = {}; // 中介者可以执行的操作
    /****************新增一个玩家***************************/ 
    operations.addPlayer = function( player ){
        var teamColor = player.teamColor; // 玩家的队伍颜色
        players[ teamColor ] = players[ teamColor ] || []; // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍 
        players[ teamColor ].push( player ); // 添加玩家进队伍
    };
    /****************移除一个玩家***************************/ 
    operations.removePlayer = function( player ){
        var teamColor = player.teamColor, // 玩家的队伍颜色
        teamPlayers = players[ teamColor ] || []; // 该队伍所有成员
        for ( var i = teamPlayers.length - 1; i >= 0; i-- ){ // 遍历删除
            if ( teamPlayers[ i ] === player ){ 
                teamPlayers.splice( i, 1 );
            } 
        }
    };
    /****************玩家换队***************************/ 
    operations.changeTeam = function( player, newTeamColor ){ // 玩家换队
        operations.removePlayer( player ); // 从原队伍中删除
        player.teamColor = newTeamColor; // 改变队伍颜色
        operations.addPlayer( player );// 增加到新队伍中
    };
    /****************玩家死亡***************************/ 
    operations.playerDead = function( player ){ // 玩家死亡
        var teamColor = player.teamColor,
        teamPlayers = players[ teamColor ]; // 玩家所在队伍
        var all_dead = true;
        for ( var i = 0, player; player = teamPlayers[ i++ ]; ){ 
            if ( player.state !== 'dead' ){
                all_dead = false;
                break; 
            }
        }
        if ( all_dead === true ){// 全部死亡
            for ( var i = 0, player; player = teamPlayers[ i++ ]; ){ 
                player.lose(); // 本队所有玩家 lose
            }
            for ( var color in players ){ 
                if ( color !== teamColor ){
                    var teamPlayers = players[ color ];  // 其他队伍的玩家
                    for( var i = 0, player; player = teamPlayers[ i++ ]; ){
                        player.win(); // 其他队伍所有玩家 win
                    } 
                }
            } 
        }
    };

    var reciveMessage = function() {
        var message = Array.prototype.shift.call( arguments ); 
        operations[ message ].apply( this, arguments );
    };
    return {
        reciveMessage: reciveMessage
    } 
})();
/*******************设置工厂函数*****************/
var playerFactory = function( name, teamColor ){
    var newPlayer = new Player( name, teamColor ); // 创造一个新的玩家对象     
    playerDirector.reciveMessage( 'addPlayer', newPlayer ); // 给中介者发送消息，新增玩家
    return newPlayer; 
};
//红队
var player1 = playerFactory('皮蛋', 'red' ), 
    player2 = playerFactory('小乖', 'red' ),
    player3 = playerFactory( '宝宝', 'red' ), 
    player4 = playerFactory('小强', 'red' );
// 蓝队:
var player5 = playerFactory('黑妞', 'blue' ),
    player6 = playerFactory( '葱头', 'blue' ),  
    player7 = playerFactory( '胖墩', 'blue' ),
    player8 = playerFactory( '海盗', 'blue' );
player1.die(); 
player2.die();
player3.die(); 
player4.die();
```

![](resource/167d8a241662b8fc)

现在可以随时的进行掉线或者换队操作，玩家之间的耦合基本上消失了。

**使用时机**

中介者模式可以非常方便地对模块或者对象进行解耦，但对象之间并非一定需要解耦。在实际项目中，模块或对象之间有一些依赖关系是很正常的。毕竟我们写程序是为了快速完成项目交付生产，而不是堆砌模式和过度设计。关键就在于如何去衡量对象之间的耦合程度。一般来说， 如果对象之间的复杂耦合确实导致调用和维护出现了困难，而且这些耦合度随项目的变化呈指数增长曲线，那我们就可以考虑用中介者模式来重构代码。

**小结**

中介者模式是迎合迪米特法则的一种实现。迪米特法则也叫最少知识原则，是指一个对象应该尽可能少地了解另外的对象。如果对象之间的耦合性太高，一个对象 发生改变之后，难免会影响到其他的对象，而在中介者模式里，对象之间几乎不知道彼此的存在，它们只能通过中介者对象来互相影响对方。
因此，中介者模式使各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象 之间的网状多对多关系。各个对象只需关注自身功能的实现，对象之间的交互关系交给了中介者 对象来实现和维护。
不过，中介者模式也存在一些缺点。其中，最大的缺点是系统中会新增一个中介者对象，因 为对象之间交互的复杂性，转移成了中介者对象的复杂性，使得中介者对象经常是巨大的。中介 者对象自身往往就是一个难以维护的对象。
