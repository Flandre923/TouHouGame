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
    // 待定的参数
    bossMonsterType = 'boss';
    monsterTypes = ['type1', 'type2', 'type3'];
    // 玩家
    @property(cc.Node)
    player:cc.Node = null;
    onLoad () {}

    start () {

    }

    update (dt) {}

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
    generateMonster(playerPosition: cc.Vec2, mapSize: cc.Size, waveNumber: number){

    }
    // 判断是否在地图内
    isInMap(position: cc.Vec2, mapSize: Array<number>): boolean {
        return position.x >= 0 && position.x <= mapSize[0] && position.y >= 0 && position.y <= mapSize[0];
    }
}
