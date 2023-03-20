import PlayerControl from "./PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerManager extends cc.Component {

    // 分数
    score:number = 0;
    
    // 管理显示UI节点
    @property(cc.Node)
    playerShowManagerNode:cc.Node
    @property(cc.Node)
    player:cc.Node
    // 血量文字节点
    @property(cc.Node)
    hpNode:cc.Node
    // 分数节点
    @property(cc.Node)
    scoreNode:cc.Node
    // Spell显示节点
    @property(cc.Node)
    spellNode:cc.Node
    // 设计火力显示节点
    @property(cc.Node)
    shotFireNode:cc.Node
    start () {
    }

    update (dt) {
        this.updatePosition(dt)
        this.showHp()
        this.showShotFire()
        this.showSpell()
        this.showScore()
    }
    //UI跟随摄像机移动
    updatePosition(dt){
        // let cameraX = cc.Camera.main.node.x
        // let cameraY = cc.Camera.main.node.y
        // this.playerShowManagerNode.x = cameraX - 200
        // this.playerShowManagerNode.y = cameraY + 100

        let canvas = cc.Canvas.instance.node;
        let camera = cc.Camera.main;
        let cameraPos = camera.node.getPosition();
        let maxX = canvas.width / 2;  // 300 
        let maxY = canvas.height / 2; // 300
        let offsetX = maxX / camera.zoomRatio;
        let offsetY = maxY / camera.zoomRatio;
        this.playerShowManagerNode.x = cameraPos.x + offsetX - this.playerShowManagerNode.width / 2;
        this.playerShowManagerNode.y = cameraPos.y + offsetY - this.playerShowManagerNode.height / 2;

    }
    // 显示当前血量
    showHp(){
        this.hpNode.children[0].getComponent(cc.Label).string = this.player.getComponent(PlayerControl).playerHp + ""
    }
    // 显示当前的火力
    showShotFire(){
        this.shotFireNode.children[0].getComponent(cc.Label).string = this.player.getComponent(PlayerControl).playerShotFire + ""
    }
    // 显示当前的spell
    showSpell(){
        this.spellNode.children[0].getComponent(cc.Label).string = this.player.getComponent(PlayerControl).playerSpell + ""
    }

    // 显示分数
    showScore(){
        this.scoreNode.children[0].getComponent(cc.Label).string = this.score+""
    }
}
