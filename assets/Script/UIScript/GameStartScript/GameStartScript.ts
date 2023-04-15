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
        cc.director.loadScene('MainScene');
    }
    //load button
    onLoadButtonClick(){
        // game load 
    }

    // rank button
    onRankButtonClick(){
        // 打开浏览器的一个网址
        cc.sys.openURL("http://www.baidu.com")
    }

    // quitbutton
    onQuitButtonClick(){
        // game end
        cc.game.end()
    }

}
