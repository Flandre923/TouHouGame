import PlayerControl from "../PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PPointScript extends cc.Component {

    @property
    power = 1;
    @property
    lifeTime = 10;

    private countDown:number = 0;
    onLoad () {
        // cc.director.getPhysicsManager().enabled = true;

    }
    start () {
        this.countDown = this.lifeTime;
    }
    update (dt) {
        if (this.countDown > 0) {
            this.countDown -= dt;
            if (this.countDown <= 0) {
                this.node.destroy(); // 销毁道具节点
            }
        }
    }
    // 碰撞开始
    onBeginContact(contact, self, other) {
        if (other.node.name == "Player") {
            // 玩家获得道具
            other.node.getComponent(PlayerControl).setFire(this.power);
            //当前节点销毁
            this.node.destroy();
        }
    }

    onEndContact(contact, self, other) {
    }
}
