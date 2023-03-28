import SmallSpirit from "./SmallSripit";

const {ccclass, property} = cc._decorator;
@ccclass
export default class EnemyManager extends cc.Component {

    // 每波生成怪物函数的参数
    L =100
    x0 = 8
    k = 0.3
    // 生成怪物的一个下限
    monsterNumberFloor = 10;
    // 最小距离玩家生成的位置
    maxDistanceFromPlayer = 100;
    // 生成boss的间隔波数
    bossWaveNumber = 10;
    //当前的第几波
    currentWave = 1;
    // 当前生成了多少只怪物
    currentNumberOfMonster = 0;
    // 参数怪物的距离玩家多远
    distance=100
    // 生成对象的预制体
    @property(cc.Prefab)
    smallSripit:cc.Prefab;
    // 玩家
    @property(cc.Node)
    player:cc.Node = null;
    // 敌人池
    enemyPool:cc.NodePool = null;
    onLoad () {
        
    }

    start () {
       // 循环10次
        let nodepool = new cc.NodePool();
        for (let i = 0; i < this.bossWaveNumber; i++) {
            this.generateMonster(this.player,this.smallSripit,nodepool)
        }
    }

    update (dt) {
        
    }

    // 每次生成怪物的个间隔数目和生成的次数
    genMonsterTimeAndNumber(time:number,count:number){

    }
    // 每波的怪物最大的数量
    getMaxMonstersPerWave(x:number){
        // 有一个问题是精英怪的生成 希望和当前生成怪的数目和一个概率挂钩
        let monsterNumber = Math.floor(this.L / (1+Math.exp(-this.k*(x-this.x0))))
        if(this.monsterNumberFloor<10){
            return 10
        }else{
            return monsterNumber
        }
    }
    // 根据玩家的位置获得敌人的位置和方向
    generateEnemyPositionAndDirection(player: cc.Node,distance:number){
        let playerPos = player.getPosition();
        // 获得一个随机的角度
        let angle = Math.random() * Math.PI * 2;
        let enemyX = playerPos.x + Math.cos(angle) * distance;
        let enemyY = playerPos.y + Math.sin(angle) * distance;
        let enemyPos = new cc.Vec2(enemyX, enemyY);
        // 获得玩家相对敌人的方向
        let enemyDir = playerPos.sub(enemyPos).normalize();
        return {position: enemyPos, direction: enemyDir};
    }
    // 产生怪物
    generateMonster(player: cc.Node, enemyPrefab: cc.Prefab, enemyPool: cc.NodePool){
        let enemy: cc.Node = null;
        if (enemyPool.size() > 0) {
            enemy = enemyPool.get();
        } else {
            enemy = cc.instantiate(enemyPrefab);
        }
        let {position, direction} = this.generateEnemyPositionAndDirection(player,this.distance);
        enemy.setPosition(position);
        // 给敌人设置方向
        enemy.angle = -cc.misc.radiansToDegrees(Math.atan2(direction.y, direction.x));
        this.node.addChild(enemy);
        enemy.getComponent(SmallSpirit).init(player, enemyPool);
    }
    // 判断是否在地图内
    isInMap(position: cc.Vec2, mapSize: Array<number>): boolean {
        return position.x >= 0 && position.x <= mapSize[0] && position.y >= 0 && position.y <= mapSize[0];
    }
}
