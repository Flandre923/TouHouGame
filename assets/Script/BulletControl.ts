import SmallSpirit from "./EnemyScript/SmallSripit";
import MapBounds from "./MapBounds";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletControl extends cc.Component {

    @property(cc.Vec2)
    public direction: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Float)
    public speed: number = 100.0;
    // 子弹伤害
    @property(cc.Integer)
    public damage: number = 2;

    onLoad () {
        // 开启碰撞检测
        cc.director.getPhysicsManager().enabled = true;
    }
    start () {
    }
    update(dt) {
        this.bulletMove(dt)
    }

    init(parent:cc.Node,position:cc.Vec2,direction:cc.Vec2){
        this.node.parent = parent;
        this.node.setPosition(position);
        this.direction = direction;
        this.speed = 100;
        this.node.angle =-cc.misc.radiansToDegrees(direction.signAngle(cc.v2(1,0)));
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

    // 射线碰撞相关的内容
    // testShotLineCollision() {
    //     // 打出一条射线
    //     let res = cc.director.getPhysicsManager().rayCast(this.node.getPosition(),cc.v2(this.node.x,this.node.y+100),cc.RayCastType.Closest);
    //     for (let i = 0; i < res.length; i++) {
    //         let res1 = res[i];
    //         // 碰撞的对象
    //         //res1.collider
    //         //res1.point
    //         //res1.normal
    //     }
    // }

    // 碰撞开始
    onBeginContact(contact, self, other) {
        // 得到碰撞点
        //let contactPoint = contact.getWorldManifold().points;
        // 法线
        //let normal = contact.getWorldManifold().normal;
        //
        if(other.node.name == "SmallSpirit"){
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
