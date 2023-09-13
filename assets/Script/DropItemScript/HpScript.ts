import PlayerControl from "../PlayerControl";
import PPointScript from "./PPointScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HpScript extends PPointScript {

    @property
    hp = 1;

    onDie(other){
        const playerControlScript = other.node.getComponent(PlayerControl)
        playerControlScript.setHp(this.hp);
    }
}
