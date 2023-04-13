const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // onLoad () {}

    start () {

    }

    onButtonClick(){
        window.open("http://www.baidu.com");
    }

    // update (dt) {}
}
