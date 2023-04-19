import Util from "../Util/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManger extends cc.Component {


    public gameOver(){
        
    }
    public uploadRank(score:number){
        const url = 'http://localhost:5000/admin/uploadRank';
        const token = cc.sys.localStorage.getItem("my_token");
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
}
