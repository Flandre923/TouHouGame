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
        // 退出游戏并返回到主菜单
        cc.director.loadScene('MainMenuScene');
        // 是否是人物死亡，若是不存档，否则就存档 上传分数
    }


}
