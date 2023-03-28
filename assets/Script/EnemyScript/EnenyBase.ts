const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBase extends cc.Component {
    
    // 血量
    health:number;
    // 移动速度
    moveSpeed:number;
    // 拥有的符卡类型及符卡的顺序

    // 根据符卡进行行动
    // 玩家对象
    player:cc.Node;
    // 对象池
    enemyPool:cc.NodePool


    // onLoad () {}

    start () {

    }

    move(dt){

    }
    spawn(x:number,y:number){
        
    }
    die(){

    }
    shoot(){

    }

    // update (dt) {}
}
