import MapBounds from "../MapBounds";
import SmallSpirit from "./SmallSripit";

const {ccclass, property} = cc._decorator;
@ccclass
export default class EnemyManager extends cc.Component {

    // 生成对象的预制体
    @property(cc.Prefab)
    smallSripit:cc.Prefab;
    // 玩家
    @property(cc.Node)
    player:cc.Node = null;

    // 每波生成怪物函数的参数
    L =100
    x0 = 8
    k = 0.3
    // 生成怪物的一个下限
    monsterNumberFloor = 10;
    // 生成boss的间隔波数
    bossWaveNumber = 10;
    //当前的第几波
    currentWave = 1;
    // 当前生成了多少只怪物
    currentNumberOfMonster = 0;
    // 当前场上还有多少只存活的敌人。
    currentLivEenemyNumber = 0;
    // 参数怪物的距离玩家多远
    distance=300
    // 敌人池
    enemyPool:cc.NodePool = new cc.NodePool;
    // 当前的分数
    score:number = 0;
    onLoad () {
        this.currentNumberOfMonster = this.getMaxMonstersPerWave(this.currentWave);
    }

    start () {
        // 循环10次
        // this.generateMonster(this.player,this.smallSripit,this.enemyPool)

        this.schedule(()=>{
            if (this.currentNumberOfMonster > 0){
                this.generateMonster();
                this.currentNumberOfMonster --;
                this.currentLivEenemyNumber ++;
            } else {
                if(this.checkWaveClear()){
                    if(this.currentWave % this.bossWaveNumber == 0){
                        this.generateBoss();
                        this.currentLivEenemyNumber++;
                    }else{
                        this.currentWave ++;
                        this.currentNumberOfMonster = this.getMaxMonstersPerWave(this.currentWave);
                    }
                }
            }
        },1)
    }

    update (dt) {
    }

    // 判断当前场景中的怪物是否已经全部死亡了
    checkWaveClear(){
        if(this.currentNumberOfMonster <= 0 && this.currentLivEenemyNumber <= 0){
            return true
        }
        return false
    }

    // 生成boss
    generateBoss(){
        
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
        // 对位置做判断没有超出地图的位置，就生成该位置，否则生成在地图边
        let mapBounds = MapBounds.Instance.getBounds(this.distance);
        let enemyPos = this.isInMap(new cc.Vec2(enemyX, enemyY), mapBounds);
        // 获得玩家相对敌人的方向
        let enemyDir = playerPos.sub(enemyPos).normalize();
        return {position: enemyPos, direction: enemyDir};
    }

    //根据生成怪物的数量去每隔一段时间生成一只怪物，同时数量减一，所有数量为零停止
    generateMonster(){
        let enemy: cc.Node = null;
        if (this.enemyPool.size() > 0) {
            enemy = this.enemyPool.get();
        } else {
            enemy = cc.instantiate(this.smallSripit);
        }
        let {position, direction} = this.generateEnemyPositionAndDirection(this.player,this.distance);
        enemy.setPosition(position);
        // 给敌人设置方向
        enemy.angle = -cc.misc.radiansToDegrees(Math.atan2(direction.y, direction.x));
        this.node.addChild(enemy);
        enemy.getComponent(SmallSpirit).currentDown = ()=>{
            this.currentLivEenemyNumber --;
            this.score+=enemy.getComponent(SmallSpirit).score;
        };
        enemy.getComponent(SmallSpirit).init(this.player, this.enemyPool);
    }
    
    // 判断是否在地图内
    isInMap(position: cc.Vec2, mapSize: Array<number>): cc.Vec2 {
        if (position.x <= mapSize[2] ) {
            position.x = mapSize[2]
        }else if(position.x >= mapSize[3]){
            position.x = mapSize[3]
        }
        if(position.y >= mapSize[0]){
            position.y = mapSize[0]
        }else if(position.y > mapSize[1]){
            position.y = mapSize[1]
        }
        return position
    }

    
}
