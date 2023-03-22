import EnemyBase from "./EnenyBase";

const {ccclass, property} = cc._decorator;
@ccclass
export default class SmallSpirit extends EnemyBase{

    @property(cc.Node)
    player:cc.Node = null;


    // onLoad () {}

    start () {
        this.health = 5
        this.moveSpeed = 1
    }

    update(dt) {
        this.move(dt)
    }
    // 初始化设置属性
    setAttribute(health:number=5,moveSpeed:number=1){
        this.health = health
        this.moveSpeed = moveSpeed
    }
    // 怪向人物移动
    move(dt){
        super.move(dt)
        if(this.player){
            let playerPos = this.player.getPosition();
            let enemyPos = this.node.getPosition();
            let direction = new cc.Vec2()
            // 计算敌人和玩家的方向
            cc.Vec2.subtract(direction,playerPos,enemyPos);
            //  归一化
            direction.normalize();
            // 计算方向的移动速度
            let velocity = new cc.Vec2();
            cc.Vec2.multiplyScalar(velocity,direction,this.moveSpeed*dt)
            // 增加速度给敌人的位置
            let newPos = new cc.Vec2();
            cc.Vec2.add(newPos,enemyPos,velocity)
            this.node.setPosition(newPos)

        }
    }

}
