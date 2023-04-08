import EnemyManager from "../EnemyScript/EnemyManager";
import PlayerControl from "../PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerManager extends cc.Component {

    // 分数
    score:number = 0;
    //玩家
    @property(cc.Node)
    player:cc.Node;
    // 管理敌人生成的节点
    @property(cc.Node)
    enemyManagerNode:cc.Node;
    // 血量文字节点
    hpNode:cc.Node
    // 分数节点
    scoreNode:cc.Node
    // Spell显示节点
    spellNode:cc.Node
    // 设计火力显示节点
    shotFireNode:cc.Node
    // 设计显示波次节点
    waveEnemyNode;
    // 设计显示剩余敌人节点
    surplusEnemyNode:cc.Node
    start () {
        this.hpNode = this.node.children[0]
        // console.log(this.hpNode.getComponent(cc.Label).string)
        this.spellNode = this.node.children[1]
        this.shotFireNode = this.node.children[2]
        this.scoreNode = this.node.children[3]
        this.waveEnemyNode = this.node.children[4]
        this.surplusEnemyNode = this.node.children[5]
    }
    onload(){
    }

    update (dt) {
        this.updatePosition(dt)
        this.showHp()
        this.showShotFire()
        this.showSpell()
        this.showScore()
        this.showWave()
        this.showWavePeople()
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
        this.node.x = cameraPos.x + offsetX - this.node.width / 2;
        this.node.y = cameraPos.y + offsetY - this.node.height / 2;

    }
    // 显示当前血量
    showHp(){
        this.hpNode.getComponent(cc.Label).string = "hp:"+ this.player.getComponent(PlayerControl).playerHp
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
        this.scoreNode.children[0].getComponent(cc.Label).string = this.enemyManagerNode.getComponent(EnemyManager).score+"";
    }
    // 显示波次
    showWave(){
        this.waveEnemyNode.getComponent(cc.Label).string = "当前的波次："+this.enemyManagerNode.getComponent(EnemyManager).currentWave
    }
    // 显示剩余人数
    showWavePeople(){
        let number = this.enemyManagerNode.getComponent(EnemyManager).currentLivEenemyNumber
        this.surplusEnemyNode.getComponent(cc.Label).string = "当前波次的是否剩余敌人是：" + (number>0 ? "是" : "否");
        // this.surplusEnemyNode.getComponent(cc.Label).string = "当前波次的是否剩余敌人是：" + number;
    }
}
