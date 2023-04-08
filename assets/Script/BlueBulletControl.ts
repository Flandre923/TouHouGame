import SmallSpirit from "./EnemyScript/SmallSripit";
import MapBounds from "./MapBounds";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // 子弹方向
    direction: cc.Vec2 = cc.Vec2.ZERO;
    // 初始方向
    initialDirection: cc.Vec2 = cc.v2(0, 0);
    // 飞行距离
    distance: number = 0;
    // 子弹转弯的飞行距离
    turnDistance: number = 20;
    // 子弹是否已经转弯
    turned: boolean = false;
    //子弹速度
    @property(cc.Float)
    public speed: number = 100;
    // 子弹伤害
    @property(cc.Integer)
    public damage: number = 1;
    // 追踪对象
    target:Array<cc.Node>=[];


    init(parent:cc.Node,position: cc.Vec2, direction: cc.Vec2, target): void {
        console.log("---initBlueBullet----")
        //设置父节点
        this.node.parent = parent;
        // 设置子弹的位置
        this.node.setPosition(position);
        // 设置子弹的初始方向向量，归一化
        this.initialDirection = direction.normalize();
        // 设置子弹的方向向量，与初始方向向量一致
        this.direction = this.initialDirection.clone();
        // 设置子弹的角度，与方向向量一致
        this.node.angle = -cc.misc.radiansToDegrees(Math.atan2(this.direction.y, this.direction.x));
        // 设置子弹的目标敌人
        this.target = target;
        // 设置子弹的飞行距离为0
        this.distance = 0;
        // 设置子弹的转弯距离为100
        this.turnDistance = 100;
        // 设置子弹是否已经转弯为false
        this.turned = false;
        this.node.active = true
    }
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
        // if (this.node.x > bounds[2] || this.node.x < bounds[3] || this.node.y > bounds[0] || this.node.y < bounds[1]) {
        //     this.node.destroy();
        // }

        // 如果子弹没有目标敌人，或者目标敌人已经死亡，销毁子弹
        if (this.target.length <= 0 || this.target[1] == null) {
            this.node.destroy();
            return;
        }
        // 如果子弹没有转弯，并且飞行距离超过了转弯距离，更新子弹的方向向量，指向目标敌人，并设置子弹已经转弯为true
        if (!this.turned && this.distance > this.turnDistance) {
            if(this.target[1]!=null){
                this.direction = this.target[1].getPosition().sub(this.node.getPosition()).normalize();
                this.turned = true;
            }
        }

        // 更新子弹的角度，与方向向量一致
        this.node.angle = -cc.misc.radiansToDegrees(Math.atan2(this.direction.y, this.direction.x));

         // 更新子弹的位置，沿着方向向量移动
        let deltaPosition = this.direction.mul(this.speed * dt);
        this.node.setPosition(this.node.getPosition().add(deltaPosition))
        // 更新子弹的飞行距离，加上本帧移动的距离
        this.distance += deltaPosition.mag();

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
            this.node.destroy();
        }
    }
    // 碰撞结束
    onEndContact(contact, self, other) {
    }
}
