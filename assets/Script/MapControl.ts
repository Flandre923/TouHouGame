const {ccclass, property} = cc._decorator;

@ccclass
export default class MapControl extends cc.Component {
    map:cc.TiledMap|null=null;
    @property(cc.Node)
    player:cc.Node|null = null;


    start () {
        //获取地图信息
        // this.map = this.getComponent(cc.TiledMap);
        //获得普通层
        // this.map.getLayer();
        //获得对象层
        // let playLayer = this.map.getObjectGroup("对象层 1")
        //获得玩家对象
        // let playerObjs = playLayer.getObjects()
        // let playerObj = playerObjs[0];
        // console.log(playerObjs)
        // if(playerObj.isPlayer){
            //创建玩家预设体
        // cc.loader.loadRes('Prefab/Player',cc.Prefab,(res,playerPre)=>{
        //     //
        //     this.player = cc.instantiate(playerPre);
        //     this.player.setParent(this.node.children[2].children[0]);
        //     this.player.x = 0;
        //     this.player.y = 0;
        // })
        // }

    }

    update(dt){
        if(this.player != null){
            cc.Camera.main.node.x = this.player.x +300;
            cc.Camera.main.node.y = this.player.y +300;
        }
    }

}
