import SmallSpirit from "./EnemyScript/SmallSripit";
import Input from "./Input";
import MapBounds from "./MapBounds";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    //子弹速度
    @property(cc.Float)
    public speed: number = 100;
    // 子弹伤害
    @property(cc.Integer)
    public damage: number = 1;
    // 追踪对象
    target:cc.Node = null;


    onLoad() {
    }
    start() {
    }
    update(dt) {
        this.bulletMove(dt)
    }

    // 追踪子弹移动算法
    bulletMove(dt) {
        // 获得地图的边界
        let bounds = MapBounds.Instance.getBounds(this.getBulletRadius())
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

        if (this.target===null || !this.target.isValid) {
            this.node.destroy(); // 如果目标敌人已经被销毁，则销毁弹幕
            return;
        }
        // 计算弹幕追踪目标方向
        // let pos = this.node.getPosition()
        // console.log("---------------"+this.target)
        // let t_pos= this.target.position
        let direction = this.target.position.sub(this.node.position).normalize();

        // // 计算弹幕速度和位置变化
        let distance = this.speed * dt;
        let bulletPos = this.node.position.add(direction.mul(distance));

        // // 更新弹幕位置
        this.node.setPosition(bulletPos);

    }

    getBulletRadius() {
        return this.node.width / 2;
    }

    // 碰撞开始
    onBeginContact(contact, self, other) {
        // 得到碰撞点
        //let contactPoint = contact.getWorldManifold().points;
        // 法线
        //let normal = contact.getWorldManifold().normal;
        //
        if (other.node.name == "SmallSpirit") {
            // 调用敌人受到伤害的方法
            other.node.getComponent(SmallSpirit).onHit(this.damage);
        }

        if(other.node.name != "Player"){
            this.node.destroy();
        }
    }
    // 碰撞结束
    onEndContact(contact, self, other) {
    }
}
