const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBase extends cc.Component {
    
    // 血量
    health:number;
    // 移动速度
    moveSpeed:number;
    // 拥有的符卡类型及符卡的顺序
    // 对碰撞对玩家造成伤害
    damage:number;
    // 根据符卡进行行动
    // 玩家对象
    player:cc.Node;
    // 本怪物击杀后加分
    score:number;
    // 对象池
    enemyPool:cc.NodePool
    // 死亡函数


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
