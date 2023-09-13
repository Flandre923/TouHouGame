import MapBounds from "../MapBounds";
import DaiyouseiScript from "./DaiyouseiScript";
import LingMengBoss from "./LingMengBoss";
import SmallSpirit from "./SmallSripit";

const {ccclass, property} = cc._decorator;
@ccclass
export default class EnemyManager extends cc.Component {

    // 生成对象的预制体
    @property(cc.Prefab)
    smallSripit:cc.Prefab;
    @property(cc.Prefab)
    bigSripit:cc.Prefab;
    // 生成boss预制体
    @property({type:[cc.Prefab]})
    bossPrefab:cc.Prefab[] = [];
    @property({type:[cc.Node]})
    uiNodes:cc.Node[]=[];
    // 玩家
    @property(cc.Node)
    player:cc.Node = null;
    // 弹幕预制体管理节点
    @property(cc.Node)
    bulletManager:cc.Node = null;
    @property(cc.Node)
    dropManager:cc.Node = null;
    // 当前boss索引
    private currentBossIndex = 0;

    // 每波生成怪物函数的参数
    private readonly L = 100;
    private readonly x0 = 8;
    private readonly k = 0.3;

    // 怪物生成下限  ， 玩家距离
    private readonly monsterNumberFloor = 10;
    private readonly distance = 300;
    
    public score = 0; // 分数 

    private enemyCount: number[];   //每个索引对应的敌人数量
    private rareEnemiesCount; // 生成的大妖精的数目
    private rareEnemiesLimit;
    public currentIndex: number = 0;  //当前索引

    private timeInterval: number = 1; //生成敌人的时间间隔，单位为秒
    private timeSinceLastEnemy: number = 0; //距离上一个敌人生成已经过去的时间
    public showEnemyNumber:number; // 展示敌人的剩余数目
    // 敌人池
    enemyPool:cc.NodePool = new cc.NodePool;
    onLoad () {
    }

    start () {
        this.enemyCount= Array.from({ length: 50 }, () => Math.floor(Math.random() * 5) + 1);
        for(let i =0;i<this.enemyCount.length;i++){
            this.enemyCount[i] = this.getMaxMonstersPerWave(i);
            if(i%3==0){
                this.enemyCount[i] = 1;
            }
        }
        this.showEnemyNumber = this.enemyCount[0];
        this.setRareEnemiesProperties(0);
    }

    update (dt) {
        //每隔一段时间就生成一只怪
        this.timeSinceLastEnemy += dt;
        if (this.timeSinceLastEnemy >= this.timeInterval) { //到达生成敌人的时间间隔
            // const remainingEnemies = this.enemyCount[this.currentIndex];
            if (this.enemyCount[this.currentIndex] > 0) { //当前索引下还有剩余的敌人
                if(this.currentIndex % 3 === 0 && this.currentIndex!==0){
                    this.generateBoss();
                    // this.generateMonster();
                }else{
                    if(!this.genRareEnemies(this.bigSripit,this.getRareEnemiesP())){
                        this.generateMonster();
                    }
                    
                }
                this.enemyCount[this.currentIndex]--;
            } else if (this.noMoreEnemiesOnField()) { //当前索引下所有敌人已经生成完毕且场上没有其他敌人了
                this.currentIndex++;
                this.showEnemyNumber = this.enemyCount[this.currentIndex];
                this.setRareEnemiesProperties(this.currentIndex)
            }
            this.timeSinceLastEnemy = 0; //重置计时器
        }
    }

    // 判断当前场景中的怪物是否已经全部死亡了
    noMoreEnemiesOnField(){
        const activeEnemies = this.node.children.filter(child => child.active); //过滤出所有活跃的敌人
        return activeEnemies.length === 0; //如果没有活跃敌人，则表示场上没有其他敌人了
    }

    // 生成boss
    generateBoss(){
        let enemy = cc.instantiate(this.bossPrefab[this.currentBossIndex]);
        enemy.setPosition(this.node.position);
        // 给敌人设置方向
        this.node.addChild(enemy);
        const bossComponent = enemy.getComponent(LingMengBoss);
        bossComponent.currentDown =  ()=>{
            this.showEnemyNumber --;
            this.score+=enemy.getComponent(LingMengBoss).score;
        };
    }


    // 每波的怪物最大的数量
    getMaxMonstersPerWave(x:number){
        // 有一个问题是精英怪的生成 希望和当前生成怪的数目和一个概率挂钩
        const monsterNumber = Math.floor(this.L / (1 + Math.exp(-this.k * (x - this.x0))));
        return Math.max(this.monsterNumberFloor, monsterNumber);
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
        let enemy = cc.instantiate(this.smallSripit);
        let {position, direction} = this.generateEnemyPositionAndDirection(this.player,this.distance);
        enemy.setPosition(position);
        // 给敌人设置方向
        enemy.angle = -cc.misc.radiansToDegrees(Math.atan2(direction.y, direction.x));
        this.node.addChild(enemy);
        enemy.getComponent(SmallSpirit).currentDown = ()=>{
            this.showEnemyNumber --;
            this.score+=enemy.getComponent(SmallSpirit).score;
        };
        enemy.getComponent(SmallSpirit).init(this.player, this.enemyPool);
    }
    // 生成稀有敌人
    genRareEnemies(prefab:cc.Prefab,rareProb:number){
        if(this.rareEnemiesCount < this.rareEnemiesLimit && Math.random()*100 <= rareProb){
            let enemy = cc.instantiate(prefab);
            let {position, direction} = this.generateEnemyPositionAndDirection(this.player,this.distance);
            enemy.setPosition(position);
            this.node.addChild(enemy);
            enemy.getComponent(DaiyouseiScript).currentDown = ()=>{
                this.showEnemyNumber --;
                this.score+=enemy.getComponent(DaiyouseiScript).score;
            };
            return true;
        }
        return false;
    }
    // 获得稀有敌人的生成概率
    getRareEnemiesP(){
        return this.rareEnemiesLimit/this.getMaxMonstersPerWave(this.currentIndex) * 100;
    }
    // 设置稀有敌人相关的属性
    setRareEnemiesProperties(waveNum:number){
        this.rareEnemiesLimit = Math.floor(this.getMaxMonstersPerWave(waveNum) / 5);
        this.rareEnemiesCount = 0;
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
