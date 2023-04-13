import PlayerControl from "../PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PPointScript extends cc.Component {

    @property
    power = 1;
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;

    }
    start () {
        console.log("---start")
    }
    // update (dt) {}
    // 碰撞开始
    onBeginContact(contact, self, other) {
        // 得到碰撞点
        //let contactPoint = contact.getWorldManifold().points;
        // 法线
        //let normal = contact.getWorldManifold().normal;
        //
        console.log("----player out")
        if (other.node.name == "Player") {
            console.log("---player contact")
            // 玩家获得道具
            other.node.getComponent(PlayerControl).setFire(this.power);
            //当前节点销毁
            this.node.destroy();
        }
    }

    onEndContact(contact, self, other) {
    }
}
