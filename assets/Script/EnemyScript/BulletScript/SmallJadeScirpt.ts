import MapBounds from "../../MapBounds";

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
        return this.node.width/2;
    }

    // onLoad () {}

    start () {
        this.damage = 1;
    }

    update (dt) {
        // 弹幕移动
        this.move(dt);
        // 判断是否出街
        this.outOfBounds();
    }


}
