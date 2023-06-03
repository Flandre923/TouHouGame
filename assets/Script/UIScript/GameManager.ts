import EnemyManager from "../EnemyScript/EnemyManager";
import PlayerControl from "../PlayerControl";
import Util from "../Util/Util";
import SaveData from "./SaveData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManger extends cc.Component {


    public gameOver(){
        
    }
    public uploadRank(score:number){
        const url = 'http://localhost:5000/admin/uploadRank';
        const token = cc.sys.localStorage.getItem("my_token");
        console.log(token);
        Util.postRequest(url,{
            data:{
                'username':cc.sys.localStorage.getItem("username"),
                'score':score
            },
            headers:{
                Authorization: `${token}`,
                "Content-Type": "application/json"
            }
        }).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err.message)
        })
    }
    // 获得saveData
    getSaveData():SaveData{
        // 获得玩家节点
        let  playerNode= this.node.children[0].children[0].getComponent(PlayerControl)
        let gameMangerNode = this.node.children[1].getComponent(EnemyManager)
        // 获得GameManager节点
        playerNode.playerHp
        return new SaveData(playerNode.playerHp,playerNode.playerSpell,playerNode.playerShotFire,gameMangerNode.currentIndex);
    }

    setSaveData(saveData:SaveData){
        // 获得玩家节点
        let  playerNode= this.node.children[0].children[0].getComponent(PlayerControl)
        let gameMangerNode = this.node.children[1].getComponent(EnemyManager)

        playerNode.playerHp = saveData.playerHp
        playerNode.playerSpell = saveData.playerSpell
        playerNode.playerShotFire = saveData.playerShotFire

        gameMangerNode.currentIndex = saveData.currentIndex
        // gameMangerNode.setCurrentEnemyCount(saveData.currentIndex)
    }
}
