import BulletControl from "./BulletControl";
import Input, { PlayerDirection } from "./Input";
import MapBounds from "./MapBounds";

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
    // 控制射击间隔
    shootInterval:number  = 0.2;
    // 射击定时器
    shootTimer:number = 0;
    // 射击方向
    shootDirection:cc.Vec2;

    start () {
    }
    onLoad() {
       
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

    // 人物死亡
    die(){

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
                let pos:cc.Vec2 = this.compteShotDirection();
                // 设置创建子弹的父容器
                bulletNode.parent = this.node.parent;
                // 根据玩家的方向调整子弹的方向
                bulletNode.angle = -cc.misc.radiansToDegrees(pos.signAngle(cc.v2(1,0)))
                //
                bulletNode.position = cc.v3(this.node.x+20*pos.x,this.node.y+20*pos.y,this.node.z);
                bulletNode.getComponent(BulletControl).speed = 100
                bulletNode.getComponent(BulletControl).direction = pos
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

    onDestroy () {
    }




}
