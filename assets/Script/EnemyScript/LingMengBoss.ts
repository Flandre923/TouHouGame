import BulletPrefab from "./BulletScript/BulletPrefab";
import SmallJadeScript from "./BulletScript/SmallJadeScirpt";
import { AbSpellCard } from "./CradScript/SpellCard";

const { ccclass, property } = cc._decorator;

enum EnemyState {
    MOVE, // 移动状态
    SPELLCARD // 发射弹幕状态
}

@ccclass
export default class LingMengBoss extends cc.Component {

    // 基本属性
    private _hp: number;
    private _maxHp: number = 100;
    private _speed: number;
    private _score: number;

    // 其他的属性
    private _state: EnemyState; // 当前状态
    private _spellCardIndex: number; // 当前符卡的索引
    private _spellCardTimer: number; // 符卡持续时间计时器

    // 符卡
    _spellCards: AbSpellCard[];

    start() {
        // 初始化属性
        // this._hp = this._maxHp;
        // this._speed = 100;
        // this._score = 50;
        // // 其他属性的初始化...
        // this._state = EnemyState.SPELLCARD;
        // this._spellCardIndex = 0;
        // this._spellCardTimer = 0;
        // // 符卡初始化
        // this._spellCards = [];
        // let card1 = new AbSpellCard("[test1]test1", 5, []);
        // let bulletNumbers = card1.bulletNumbers
        // console.log("---"+bulletNumbers.length)
        // console.log("---"+bulletNumbers[0])
        // console.log("---"+BulletPrefab.instance.bigJadePrefab)
        // card1.bulletCallback = () => {
            // setInterval(() => {
                // console.log(bulletNumbers.length)
                // const bulletPrefab = bulletNumbers[0];
                // console.log(bulletPrefab)
                // const bulletNode = cc.instantiate(bulletPrefab); // 创建弹幕节点
                // console.log(bulletNode)
                // bulletNode.position = this.node.position; // 设置弹幕位置为符卡节点位置
                // bulletNode.parent = this.node
                // const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件
                // // 设置弹幕移动方向
                // const direction = cc.v2(1, 0); // 向右发射
                // direction.rotateSelf(Math.random() * 2 * Math.PI); // 随机旋转方向
                // direction.normalizeSelf();
                // bulletComponent.direction = direction; 
                // // 设置弹幕速度和伤害
                // bulletComponent.speed = 300; 
                // bulletComponent.damage = 1; 
                // //bulletComponent move的方法
                // bulletComponent.move = (dt)=>{
                //     bulletNode.x += bulletComponent.direction.x * dt * bulletComponent.speed;
                //     bulletNode.y += bulletComponent.direction.y * dt * bulletComponent.speed;
                // }
            // }, 500)
        // }


        // this._spellCards.push(card1);
    }

    update(dt: number) {
        // switch (this._state) {
        //     case EnemyState.MOVE:
        //         // 处理移动逻辑
        //         break;
        //     case EnemyState.SPELLCARD:
        //         // 处理符卡逻辑
        //         // this._spellCardTimer += dt;
        //         // console.log(this._spellCardIndex)
        //         // console.log(this._spellCards[this._spellCardIndex])
        //         // if (this._spellCardTimer >= this._spellCards[this._spellCardIndex].duration) {
        //         //     // 符卡时间结束，回到移动状态
        //         //     this._state = EnemyState.SPELLCARD;
        //         //     this._spellCardTimer = 0;
        //         //     this.updateCard();
        //         // }
        //         // this.enterSpellCard()
        //         break;
        // }
    }
    // 敌人死亡
    onDie() {
        this.node.destroy();
    }

    // // 进入发射弹幕状态
    private enterSpellCard() {
        this._state = EnemyState.SPELLCARD;
        this.updateCard();
        this._spellCards[this._spellCardIndex].runBulletCallBack(); // 执行符卡的回调函数
    }

    private updateCard() {
        if (this._spellCardIndex >= this._spellCards.length && this._hp <= 0) {
            this._spellCardIndex = 0;
            this.onDie()
        } else if (this._spellCardIndex < this._spellCards.length && this._hp <= 0) {
            this._hp = this._maxHp;
            this._spellCardIndex++;
        }
    }
}
