export default class GameData{
    // 包含玩家属性 
    playerHp:number
    playerSpell:number
    playerShotFire:number
    // 包含关卡属性
    currentIndex:number
    // 构造方法
    public constructor(playerHp:number,playerSpell:number,playerShotFire:number, currentIndex:number){
        this.playerHp = playerHp;
        this.playerSpell = playerSpell;
        this.playerShotFire = playerShotFire;
        this.currentIndex = currentIndex;
    }
}


