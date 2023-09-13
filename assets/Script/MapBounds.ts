
const {ccclass, property} = cc._decorator;

@ccclass
export default class MapBounds  {
    //地图节点
    mapNode: cc.Node = null;
    //实例
    private static instance:MapBounds = null;
    //获得实例
    static get Instance(){
        if(this.instance == null){
            this.instance = new MapBounds();
        }
        return this.instance
    }

    constructor(){
        this.getMapNode()
    }
    //获得地图对象
    private getMapNode(){
        this.mapNode = cc.find("/Canvas/map");
    }
    //计算地图边界
    getBounds(playerRadius:number){
        if(this.mapNode == null){
            return;
        }
        //获宗地图大小，减去玩家半径，再减去地图跟随半径，以促进玩家地图跟随，不要超函数范囶
        //地图大小减去玩家半径，再减去地图跟随半径，以促进玩家地图跟随，不要超函数范囶
        //地图大小减去玩家半径，再减去地图跟随半径，以促进玩家地图跟随，不要超函数范囶
        let mapSize = this.mapNode.getContentSize();
        mapSize = cc.size(mapSize.width - playerRadius * 2, mapSize.height - playerRadius * 2);
        const leftBoundary = this.mapNode.x - mapSize.width / 2 + playerRadius;
        const rightBoundary = this.mapNode.x + mapSize.width / 2 - playerRadius;
        const bottomBoundary = this.mapNode.y - mapSize.height / 2 + playerRadius;
        const topBoundary = this.mapNode.y + mapSize.height / 2 - playerRadius;
        return [topBoundary,bottomBoundary,leftBoundary,rightBoundary]
    }
}
