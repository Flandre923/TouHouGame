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

}
