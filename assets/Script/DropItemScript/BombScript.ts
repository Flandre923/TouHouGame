import PlayerControl from "../PlayerControl";
import PPointScript from "./PPointScript";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BombScript extends PPointScript {
    @property
    spell = 1;
    
    onDie(other){
        const playerControlScript = other.node.getComponent(PlayerControl)
        playerControlScript.setSpell(this.spell);
    }
}
