import MapBounds from "./MapBounds";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletControl extends cc.Component {

    @property(cc.Vec2)
    public direction: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Float)
    public speed: number = 500.0;

    // onLoad () {}
    start () {
    }
    update(dt) {
        this.bulletMove(dt)
    }

    bulletMove(dt){
        // 获得地图的边界
        let bounds =  MapBounds.Instance.getBounds(this.getBulletRadius())
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
        // 子弹移动
        this.node.x = this.node.x + this.direction.x*this.speed*dt
        this.node.y = this.node.y + this.direction.y*this.speed*dt
    }

    getBulletRadius(){
        return  this.node.width / 2;
    }

}
