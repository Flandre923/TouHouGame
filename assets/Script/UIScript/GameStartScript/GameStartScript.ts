import PlayerControl from "../../PlayerControl";
import GameManger from "../GameManager";
import SaveData from "../SaveData";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    startButton:cc.Button;
    @property(cc.Button)
    loadButton:cc.Button;
    @property(cc.Button)
    rankButton:cc.Button
    @property(cc.Button)
    quitButton:cc.Button


    onLoad () {
        // 给注册点击事件
        this.startButton.node.on('click', this.onStartButtonClick, this);
        this.rankButton.node.on('click', this.onRankButtonClick, this);
        this.quitButton.node.on('click', this.onQuitButtonClick, this);
        this.loadButton.node.on('click', this.onLoadButtonClick, this);

    }
    onStartButtonClick(){
        // game start 
        // 清除游戏状态

        // 停止所有计时器和动画
        // cc.director.getScheduler().unscheduleAll();
        // cc.director.getActionManager().removeAllActions();

        // 重置游戏状态
        if(cc.director.isPaused()){
            cc.director.resume();
            cc.game.restart();
        }

        cc.director.loadScene('MainScene');
    }
    //load button
    onLoadButtonClick(){
        // game load
        cc.director.loadScene('MainScene',()=>{
            this.loadFromSave()
            // 获得playerManager 
            let playerManagerNode = cc.find("Canvas/map/对象层 1/PlayerManager")
            // 在playerManager下面获得产生playerNode
            // 加载玩家prefab
            cc.loader.loadRes("Prefab/Player", cc.Prefab, (err, prefab) => {
                playerManagerNode.addChild(cc.instantiate(prefab))
            })

        })
    }

    // rank button
    onRankButtonClick(){
        // 打开浏览器的一个网址
        cc.sys.openURL("http://localhost:8080/")
    }

    // quitbutton
    onQuitButtonClick(){
        // game end
        cc.game.end()
    }


    loadFromSave(){
        // 从本地的浏览器中读取saveData的json数据并转化为SaveData对象
        let saveDataJson = cc.sys.localStorage.getItem("saveData")
        let saveData:SaveData= JSON.parse(saveDataJson)
        console.log(saveDataJson)
        console.log(saveData.playerHp)
        // 通过GameManager设置游戏的属性。
        let gameManagerComponent = cc.find("Canvas/map/对象层 1").getComponent(GameManger);
        if (saveData){
            gameManagerComponent.setSaveData(saveData)
        }else{
            this.start()
        }

    }
}
