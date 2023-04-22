import DropItemManager from "../DropItemScript/DropItemMananger";
import BulletPrefab from "./BulletScript/BulletPrefabs";
import SmallJadeScript from "./BulletScript/SmallJadeScirpt";
import { AbSpellCard } from "./CradScript/SpellCard";
import EnemyManager from "./EnemyManager";
import LingMengBoss from "./LingMengBoss";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DaiyouseiScript extends cc.Component {

    // 基本属性
    private _hp: number;
    private _maxHp: number = 100;
    private _name: string;
    private _speed: number;
    private _score: number;

    // 其他的属性
    private _spellCardIndex: number; // 当前符卡的索引
    private _spellCardTimer: number; // 符卡持续时间计时器
    private _spellCardShotTimer: number;// 符卡波次射击计时器
    // 定义变量保存弹幕定时器 ID 和当前生成的所有弹幕节点
    private _bulletTimerId: number;
    private _bulletNodes: cc.Node[] = [];
    currentDown: Function;
    ///
    private daiyouseiBulletNode:cc.Node;
    private move:(dt)=>void;
    ///
    dropManager:cc.Node

    // 符卡
    _spellCards: AbSpellCard[];


    protected onLoad(): void {
        this._hp = this._maxHp;
        // this.updateHealthBar();
    }

    start() {
        // 初始化属性
        this._hp = this._maxHp;
        this.name = "Daiyousei"
        this._speed = 20;
        this._score = 20;
        // // 其他属性的初始化...
        this._spellCardIndex = -1;
        this._spellCardTimer = 0;
        this._spellCardShotTimer = 0;
        // // 符卡初始化
        this._spellCards = [];
        this.dropManager = this.node.parent.getComponent(EnemyManager).dropManager;
        
        let bulletPrefabScript = this.node.parent.getComponent(EnemyManager).bulletManager.getComponent(BulletPrefab)
        let playerNode = this.node.parent.getComponent(EnemyManager).player
        let card1 = new AbSpellCard("[t]tttt", 500, [bulletPrefabScript.riceBulletPrefab]);
        card1.bulletCallback = (dt) => {
            // this._bulletTimerId = setInterval(() => {
            if (Math.floor(dt) % 80 !== 0) {
                return;
            }

            // 生成大玉
            const riceBulletPrefab = card1.bulletNumbers[0];
            for (let i = 0; i < Math.PI*2; i+=Math.PI*2/10) {
                const bulletNode = cc.instantiate(riceBulletPrefab); // 创建大玉弹幕节点s
                bulletNode.position = this.node.position; // 设置弹幕位置为自机位置
                let newNode = new cc.Node();
                newNode.name = "DaiyouseiBulletNode"
                newNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager")
                bulletNode.parent = newNode // 将弹幕节点添加到弹幕管理节点
                // this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

                // 设置弹幕移动速度和方向
                bulletComponent.speed = 120;
                bulletComponent.damage = 1;
                bulletComponent.direction = cc.v2(
                    // Math.random() * 2 - 1,
                    Math.cos(i),
                    // Math.random() * 2 - 1
                    Math.sin(i)
                ).normalizeSelf();

                bulletComponent.node.angle = bulletComponent.node.angle + cc.misc.radiansToDegrees(i);
                // 设置弹幕的 move 方法
                bulletComponent.move = (dt) => {
                    bulletNode.x += bulletComponent.direction.x * dt * bulletComponent.speed;
                    bulletNode.y += bulletComponent.direction.y * dt * bulletComponent.speed;
                };
            }
        }
        // 由符卡指定人物的移动
        card1._enemyMove = (dt)=>{
            let direction = cc.v2(playerNode.x - this.node.x,playerNode.y - this.node.y).normalizeSelf();
            this.node.x += direction.x * dt * this._speed;
            this.node.y += direction.y * dt * this._speed;
        }

        this._spellCards.push(card1);
        this.updateCard()
    }

    update(dt: number) {
        // switch (this._state) {
        //     case EnemyState.MOVE:
        //         // 处理移动逻辑
        //         break;
        //     case EnemyState.SPELLCARD:
        //         //处理符卡逻辑
        //         this._spellCardTimer += dt;
        //         this._spellCardShotTimer += 1;
        //         this.enterSpellCard(this._spellCardShotTimer);
        //         if (this._spellCardShotTimer > 180) {
        //             // this._spellCardShotTimer = 0;
        //         }
        //         if (this._spellCardTimer >= this._spellCards[this._spellCardIndex].duration) {
        //             // 符卡时间结束，回到移动状态
        //             // this._state = EnemyState.MOVE;
        //             this._spellCardTimer = 0;
        //             this._hp = 0;
        //         }
        //         break;
        // }
        //处理符卡逻辑
        this._spellCardTimer += dt;
        this._spellCardShotTimer += 1;
        this.enterSpellCard(this._spellCardShotTimer);
        // if (this._spellCardShotTimer > 180) {
        //     // this._spellCardShotTimer = 0;
        // }
        if (this._spellCardTimer >= this._spellCards[this._spellCardIndex].duration) {
            // 符卡时间结束，回到移动状态
            // this._state = EnemyState.MOVE;
            this._spellCardTimer = 0;
            this._hp = 0;
        }
        if(this.move){
            this.move(dt)
        }
        this.updateCard();
    }
    // 敌人死亡
    onDie() {
        // 清除弹幕定时器
        // clearInterval(this._bulletTimerId);
        // 销毁当前生成的所有弹幕节点
        this.deleteGenBullet()
        this.currentDown();
        this.node.destroy();
        this.node.parent.getComponent(EnemyManager).uiNodes[0].active = false;
        if(this.dropManager == null){
            console.log("----dropManager null")
        }
        else{
            this.dropManager.getComponent(DropItemManager).genDropItem(this.node.name,this.node);
        }

    }

    onHit(damage: number) {
        this._hp -= damage;
        // this.updateHealthBar();
        // if (this._hp <= 0) {
        //   this.onDie();
        // }
    }

    // // 进入发射弹幕状态
    private enterSpellCard(dt) {
        // this._state = EnemyState.SPELLCARD;
        if (this._spellCards[this._spellCardIndex].runBulletCallBack) {
            this._spellCards[this._spellCardIndex].runBulletCallBack(dt); // 执行符卡的回调函数
        }
    }

    private updateCard() {
        if (this._hp <= 0) {
            this._spellCardIndex++;
            if (this._spellCardIndex >= this._spellCards.length) {
                this._spellCardIndex = 0;
                this.onDie()
            } else if (this._spellCardIndex < this._spellCards.length) {
                this._hp = this._maxHp;
                this.updateHealthBar();
                this.move = this._spellCards[this._spellCardIndex]._enemyMove
                // 将弹幕回调函数设为空
                this._spellCards[this._spellCardIndex - 1].bulletCallback = null;
                this.deleteGenBullet()
            }
        }
        if (this._spellCardIndex == -1) {
            this._spellCardIndex++;
            this.move = this._spellCards[this._spellCardIndex]._enemyMove
        }
    }

    updateHealthBar() {
        const healthBarForeground = this.node.parent.getComponent(EnemyManager).uiNodes[0].getChildByName("BossHpBarForegorud");
        const healthPercentage = this._hp / this._maxHp;
        healthBarForeground.parent.active = true;
        healthBarForeground.width = 500 * healthPercentage;
    }

    deleteGenBullet() {
        // const bullets = this.node.parent.parent.getChildByName("EnemyBulletManager").children;
        if(this.daiyouseiBulletNode){
            const bullets = this.daiyouseiBulletNode.children;
            for (let bullet of bullets) {
                bullet.destroy();
            }
            this.daiyouseiBulletNode.destroy();
            this.daiyouseiBulletNode = null;
        }

    }


    public get score() {
        return this._score;
    }

    onDestroy(): void {
        super.destroy();

    }

}
