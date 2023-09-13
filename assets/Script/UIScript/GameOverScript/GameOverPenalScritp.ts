import GameManger from "../GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverPenalScript extends cc.Component {

    @property(cc.Button)
    continueButton:cc.Button;
    @property(cc.Button)
    endButton:cc.Button;



    onLoad () {
        this.continueButton.node.on('click', this.onContinueButtonClick, this);

        // 注册结束游戏按钮点击事件
        this.endButton.node.on('click', this.onEndButtonClick, this);
    }

    start () {

    }
    onContinueButtonClick() {
        // 隐藏暂停 UI 面板
        this.node.active = false;

        // 继续游戏
        cc.director.resume();
    }

    onEndButtonClick() {
        //
        const mapNode = cc.find('Canvas/map/对象层 1');
        mapNode.children.forEach(child => {
            child.destroyAllChildren()
        })
        // 退出游戏并返回到主菜单
        cc.director.loadScene('MainMenuScene');
        
        // 存档
        this.saveGame()
    }

    saveGame(){
        //通过GameManager获得SaveData
        let gameManager = cc.find("Canvas/map/对象层 1");
        let saveData = gameManager.getComponent(GameManger).getSaveData()
        // 将SaveData保存到浏览器中
        console.log(JSON.stringify(saveData))
        cc.sys.localStorage.setItem("saveData", JSON.stringify(saveData));
        cc.director.getScene()
    }

    // 递归删除节点下所有的子节点
}

