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
    shootInterval:number  = 0.5;
    // 射击定时器
    shootTimer:number = 0;

    start () {
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
        }else if(Input.Instance.horizontal == -1){
            // 播放像左行走的动画
        }else if(Input.Instance.vertical == 1){
            // 播放向上的动画
        }else if(Input.Instance.vertical == -1){
            // 播放向下行走的动画
        }else if(Input.Instance.horizontal == 0 &&  Input.Instance.currentDirection === PlayerDirection.Right){
            //播发右闲置动画
        }else if(Input.Instance.horizontal == 0 && Input.Instance.currentDirection === PlayerDirection.Left){
            // 播发左闲置动画
        }else if(Input.Instance.vertical == 0 && Input.Instance.currentDirection === PlayerDirection.Up){
            //播发上闲置动画
        }else if(Input.Instance.vertical == 0 && Input.Instance.currentDirection === PlayerDirection.Down){
            //播发下闲置动画
        }
    }
    //角色移动
    move(dt){
        // 计算玩家可以移动的范围
        // 上下左右
        let bounds =  MapBounds.Instance.getBounds(this.getplayerRadius())

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

    // 人物半径
    getplayerRadius(){
        return  this.node.width / 2;
    }

    // 角色射击
    shotBullet(dt){
        if(Input.Instance.isShoot == 1){
            this.shootTimer += dt;
            if(this.shootTimer >= this.shootInterval){
                let bulletNode = cc.instantiate(this.bulletPrefab);
                let pos:cc.Vec2 = this.getPlayerDirection()
                bulletNode.parent = this.node.parent;
                let playerDirection = this.getPlayerDirection()
                // 根据玩家的方向调整子弹的方向
                this.adjustBulletDirection(playerDirection,bulletNode)
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

    adjustBulletDirection(playerDirection,bulletNode){
        if((playerDirection.x == 0 && playerDirection.y == -1)
            || (playerDirection.x == 0 && playerDirection.y ==1)){
            bulletNode.angle = 90
        }else if(playerDirection.x==1 && playerDirection.y == 1){
            bulletNode.angle = 45
        } else if(playerDirection.x==1 && playerDirection.y == -1){
            bulletNode.angle = -45
        } else if(playerDirection.x==-1 && playerDirection.y == 1){
            bulletNode.angle = 135
        } else if(playerDirection.x==-1 && playerDirection.y == -1){
            bulletNode.angle = -135
        } 
    }

    getPlayerDirection(){
        if(Input.Instance.horizontal == 1 || Input.Instance.vertical ==1){
            return cc.v2(Input.Instance.horizontal,Input.Instance.vertical)
        }else if(Input.Instance.currentDirection == PlayerDirection.Down){
            return cc.v2(0,-1)
        }else if(Input.Instance.currentDirection == PlayerDirection.Up){
            return cc.v2(0,1)
        }else if(Input.Instance.currentDirection == PlayerDirection.Left){
            return cc.v2(-1,0)
        }else if(Input.Instance.currentDirection == PlayerDirection.Right){
            return cc.v2(1,0)
        }
    }

    onDestroy () {
    }




}
