
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
    getBounds(playerRadius){
        let mapSize = this.mapNode.getContentSize();
        mapSize = cc.size(mapSize.width - playerRadius * 2, mapSize.height - playerRadius * 2);
        const leftBoundary = this.mapNode.x - mapSize.width / 2 + playerRadius;
        const rightBoundary = this.mapNode.x + mapSize.width / 2 - playerRadius;
        const bottomBoundary = this.mapNode.y - mapSize.height / 2 + playerRadius;
        const topBoundary = this.mapNode.y + mapSize.height / 2 - playerRadius;
        // 迷之原因 地图的坐标计算向右上偏移了300，
        return [topBoundary,bottomBoundary,leftBoundary,rightBoundary]
    }
}
