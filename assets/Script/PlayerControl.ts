import BlueBulletControl from "./BlueBulletControl";
import BulletControl from "./BulletControl";
import EnemyManager from "./EnemyScript/EnemyManager";
import SmallSpirit from "./EnemyScript/SmallSripit";
import Input, { PlayerDirection } from "./Input";
import MapBounds from "./MapBounds";
import GameManger from "./UIScript/GameManager";
import Util from "./Util/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {

    // 人物移动速度，x方向和y方向
    @property(cc.Integer)
    private speed:number = 150
    // 人物血量
    playerHp:number = 2
    // 人物最大血量
    playerMaxHp:number = 10
    // 人物最大的可以使用技能次数
    playerSpell = 0
    playerMaxSpell = 10
    // 人物射击火力
    playerShotFire = 0
    playerShotFireMax = 4
    // 子弹预制体
    @property(cc.Prefab)
    bulletPrefab:cc.Prefab = null;
    @property(cc.Prefab)
    BlueBulletPrefab:cc.Prefab = null;
    // 控制射击间隔
    shootInterval:number  = 0.2;
    // 射击定时器
    shootTimer:number = 0;
    // 射击方向
    shootDirection:cc.Vec2;
    // 受击无敌
    isInvincible:Boolean=false;
    // 受击无敌时间
    invincible_timer:number=0;
    isAlive:boolean = true;

    start () {
    }
    onLoad() {
        // 开启碰撞检测
        cc.director.getPhysicsManager().enabled = true;
    }
    update (dt) {
        // 人物移动
        this.move(dt)
        // 射击
        this.shotBullet(dt)
        // 人物动画播放
        this.playAnime(dt)
        // 设置摄像机跟随
        this.setCreamPos()
        // 人物动画播放
        this.playAnime(dt)
        // 人物受击无敌
        this.invincible(dt)
    }

    
    // 设置摄像机跟随任务
    setCreamPos(){
        cc.Camera.main.node.x = this.node.x;
        cc.Camera.main.node.y = this.node.y;
    }

    // 播放动画
    playAnime(dt){
        if(Input.Instance.horizontal == 1){
            // 播放向右行走的动画
            this.node.getComponent(cc.Animation).play("PlayerRightWalk")
        }else if(Input.Instance.horizontal == -1){
            // 播放像左行走的动画
            this.node.getComponent(cc.Animation).play("PlayerLeftWalk")
        }else if(Input.Instance.vertical == 1){
            // 播放向上的动画
            this.node.getComponent(cc.Animation).play("PlayerUpWalk")
        }else if(Input.Instance.vertical == -1){
            this.node.getComponent(cc.Animation).play("PlayerDownWalk")
            // 播放向下行走的动画
        }else if(Input.Instance.horizontal == 0 &&  Input.Instance.currentDirection === PlayerDirection.Right){
            this.node.getComponent(cc.Animation).stop('PlayerRightWalk')
            //播发右闲置动画
        }else if(Input.Instance.horizontal == 0 && Input.Instance.currentDirection === PlayerDirection.Left){
            // 播发左闲置动画
            this.node.getComponent(cc.Animation).stop('PlayerLeftWalk')
        }else if(Input.Instance.vertical == 0 && Input.Instance.currentDirection === PlayerDirection.Up){
            //播发上闲置动画
            this.node.getComponent(cc.Animation).stop('PlayerUpWalk')
        }else if(Input.Instance.vertical == 0 && Input.Instance.currentDirection === PlayerDirection.Down){
            //播发下闲置动画
            this.node.getComponent(cc.Animation).stop('PlayerDownWalk')

        }
    }
    //角色移动
    move(dt){
        // 计算玩家可以移动的范围
        // 上下左右
        let bounds =  MapBounds.Instance.getBounds(this.getPlayerRadius())

        if (this.node.x < bounds[2]) {
            this.node.x = bounds[2];
        }
        if (this.node.x > bounds[3]) {
            this.node.x = bounds[3];
        }
        if (this.node.y < bounds[1]) {
            this.node.y = bounds[1];
        }
        if (this.node.y > bounds[0]) {
            this.node.y = bounds[0];
        }


        this.node.x += this.speed * dt * Input.Instance.horizontal
        this.node.y += this.speed * dt * Input.Instance.vertical
    }

    // 人物受击无敌
    invincible(dt){
        if (this.isInvincible) {
            this.invincible_timer -= dt; // 减少计时器的剩余时间
            if (this.invincible_timer <= 0.0) {
              this.isInvincible = false; // 如果计时器的剩余时间小于等于0，则将玩家的无敌状态设置为假
            }
        }
    }
    // 人物死亡
    onDie(){
        // 写游戏结束相关的内容，游戏停止，当前用户的用户名，账号，成绩
        // 上传分数
        if (!this.isAlive) {
            return
        }
        this.isAlive = false;
        let score = this.node.parent.parent.children[1].getComponent(EnemyManager).score
        if(cc.sys.localStorage.getItem('my_token')){
            this.node.parent.parent.getComponent(GameManger).uploadRank(score)
        }
        let panelNode = null
        if(panelNode === null){
            panelNode = cc.find("Canvas/PausePanel")
            panelNode.position = this.node.position
            panelNode.active = true
            panelNode.children[1].getComponent(cc.Label).string = "分数:"+score;
            panelNode.children[2].children[0].active = false
        }
        cc.director.pause();
        
        // this.node.parent.parent.getComponent(GameManger).gameOver();
    }
    // 人物受到攻击
    onHit(damage:number):void{
        if (this.isInvincible) {
            return; // 如果玩家已经处于无敌状态，则不执行任何操作
          }
        this.isInvincible = true; // 设置玩家的无敌状态为真
        this.invincible_timer = 2.0; // 启动计时器，设置剩余时间为5秒
        this.playerHp -= damage;
        if(this.playerHp <= 0 && this.isAlive === true){
            this.onDie();
        }
    }
    // 人物设置血量
    setHp(hp:number){
        this.playerHp += hp;
        if(this.playerHp > this.playerMaxHp){
            this.playerHp = this.playerMaxHp;
        }
        if(this.playerHp <= 0){
            this.onDie();
        }
        
    }
    // 人物设置技能使用次数
    setSpell(spell:number){
        this.playerSpell += spell;
        if(this.playerSpell > this.playerMaxSpell){
            this.playerSpell = this.playerMaxSpell;
        }
        if(this.playerSpell <= 0){
            this.playerSpell=0;
        }
    }
    // 设置人物射击火力
    setFire(fire:number){
        this.playerShotFire += fire;
        if(this.playerShotFire > this.playerShotFireMax){
            this.playerShotFire = this.playerShotFireMax;
        }
        if(this.playerShotFire <= 0){
            this.playerShotFire=0;
        }
    }
    // 人物半径
    getPlayerRadius(){
        return  this.node.width / 2;
    }

    compteShotDirection () {
        let playerPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // 计算玩家到鼠标的方向向量（归一化）
        let direction:cc.Vec2 = cc.v2(1,0);
        if(Input.Instance.mousePos != null){
            direction = Input.Instance.mousePos.sub(playerPos).normalize();
            return direction
        }
        // 将方向向量保存到一个属性中，供射击函数使用
        return direction;
    }

    // 角色射击
    shotBullet(dt){
        if(Input.Instance.isShoot == 1){
            this.shootTimer += dt;
            if(this.shootTimer >= this.shootInterval){
                // 获得子弹预设体
                let bulletNode = cc.instantiate(this.bulletPrefab);
                // 计算子弹射击方向
                let direction:cc.Vec2 = this.compteShotDirection();
                // 根据玩家的方向调整子弹的方向
                let position = cc.v2(this.node.x+20*direction.x,this.node.y+20*direction.y);
                bulletNode.getComponent(BulletControl).init(this.node.parent,position,direction);

                // 子弹生成算法
                if(this.playerShotFire>0){
                    const offset = [cc.v2(20,0),cc.v2(-20,0),cc.v2(0,20),cc.v2(0,-20)]
                    for(let i =0;i<this.playerShotFire;i++){
                        // 获得子弹预设体
                        let blueBulletNode = cc.instantiate(this.BlueBulletPrefab);
                        blueBulletNode.parent = this.node.parent
                        blueBulletNode.setPosition(cc.v2(this.node.x+offset[i].x,this.node.y+offset[i].y))
                        // 根据玩家的方向调整子弹的方向
                        let blueControl = blueBulletNode.getComponent(BlueBulletControl)
                        blueControl.target =this.getNearestEnemy(this.node.parent.parent.children[1].children.slice(1))

                    }
                }

                this.shootTimer = 0;
            }
        }
        // 每个半秒产生
        // this.schedule(()=>{
        //     let bullet = cc.instantiate(this.bulletPrefab);
        //     bullet.setParent(cc.director.getScene())
        //     bullet.x = this.node.x
        //     bullet.y = this.node.y + 60;
        // },0.5)
    }

    // 找到距离玩家最近的敌人
    getNearestEnemy(es:Array<cc.Node>){
        let minDistance = Infinity;
        let nearestEnemy = null;

        for (let i = 0; i < es.length; i++) {
            const enemy:cc.Node = es[i];
            const distance:number = Math.sqrt(
            Math.pow(enemy.x - this.node.x, 2) + Math.pow(enemy.y - this.node.y, 2)
            );
            if (distance < minDistance && enemy.active == true) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }

        return nearestEnemy;
    }

    // 开始碰撞
    onBeginContact(contact, self, other) {
        if(other.node.name == "SmallSpirit"){
            this.setHp(-other.node.getComponent(SmallSpirit).damage);
        }
    }
    // 碰撞结束
    onEndContact(contact, self, other) {
    }
    onDestroy () {
    }


}
