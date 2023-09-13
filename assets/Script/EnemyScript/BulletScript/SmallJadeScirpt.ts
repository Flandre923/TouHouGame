import MapBounds from "../../MapBounds";
import PlayerControl from "../../PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SmallJadeScript extends cc.Component {

    // 弹幕伤害
    damage:number;
    // 移动速度
    speed:number;
    // 移动方向
    direction:cc.Vec2;
    // 弹幕移动
    move:(dt:number)=>void;
    // 弹幕超出地图边缘就删除
    outOfBounds():void{
        // 获得地图的边界
        let bounds =  MapBounds.Instance.getBounds(this.getRadius())
        // 子弹离开地图边界
        if (this.node.x < bounds[2]) {
            this.node.destroy();
        }
        if (this.node.x > bounds[3]) {
            this.node.destroy();
        }
        if (this.node.y < bounds[1]) {
            this.node.destroy();
        }
        if (this.node.y > bounds[0]) {
            this.node.destroy();
        }
    };

    getRadius():number{
        // return this.node.width/2;
        return 0;
    }

    // onLoad () {}

    start () {
        this.damage = 1;
    }

    update (dt) {
        // 弹幕移动
        if(this.move){
            this.move(dt);
        }
        // 判断是否出街
        this.outOfBounds();
    }

    // 开始碰撞
    onBeginContact(contact, selfCollider, otherCollider){
        // 如果是玩家那么玩家掉血
        if(otherCollider.node.name == "Player"){
            this.node.destroy();
            if(otherCollider.node.getComponent(PlayerControl).isAlive == true){
                otherCollider.node.getComponent(PlayerControl).onHit(this.damage);
                return;
            }
        }
    }
        


}
