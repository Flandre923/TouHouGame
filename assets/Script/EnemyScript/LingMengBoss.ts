import BulletPrefab from "./BulletScript/BulletPrefabs";
import GenBulletScript from "./BulletScript/GenBulletScript";
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
    private _name: string;
    private _speed: number;
    private _score: number;

    // 其他的属性
    private _state: EnemyState; // 当前状态
    private _spellCardIndex: number; // 当前符卡的索引
    private _spellCardTimer: number; // 符卡持续时间计时器
    // 定义变量保存弹幕定时器 ID 和当前生成的所有弹幕节点
    private _bulletTimerId: number;
    private _bulletNodes: cc.Node[] = [];

    // 符卡
    _spellCards: AbSpellCard[];

    // 子弹预制体
    @property(cc.Node)
    bulletPrefabNode: cc.Node;
    // // 弹幕生成管理器
    // @property(cc.Node)
    // bulletManagerNode: cc.Node;
    @property(cc.Node)
    playerNode:cc.Node

    start() {
        // 初始化属性
        this._hp = this._maxHp;
        this.name = "Rem"
        this._speed = 100;
        this._score = 50;
        // // 其他属性的初始化...
        this._state = EnemyState.SPELLCARD;
        this._spellCardIndex = -1;
        this._spellCardTimer = 0;
        // // 符卡初始化
        this._spellCards = [];
        let bulletPrefabScript = this.bulletPrefabNode.getComponent(BulletPrefab)
        let card1 = new AbSpellCard("[想起]户隐山之投", 50, [bulletPrefabScript.bigJadePrefab, bulletPrefabScript.mediumJadePrefab, bulletPrefabScript.smallJadePrefab]);
        let card2 = new AbSpellCard("[test2]test2", 50, [bulletPrefabScript.bigJadePrefab, bulletPrefabScript.mediumJadePrefab, bulletPrefabScript.smallJadePrefab]);
        let bulletNumbers = card1.bulletNumbers
        card1.bulletCallback = () => {
            this._bulletNodes = []; // 清空当前生成的所有弹幕节点
            this._bulletTimerId = setInterval(() => {
                // 生成大玉
                const bigJadePrefab = bulletNumbers[0];
                for (let i = 0; i < 30; i++) {
                    const bulletNode = cc.instantiate(bigJadePrefab); // 创建大玉弹幕节点
                    bulletNode.position = this.node.position; // 设置弹幕位置为自机位置
                    bulletNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager"); // 将弹幕节点添加到弹幕管理节点
                    this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                    const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

                    // 设置弹幕移动速度和方向
                    bulletComponent.speed = 120 + 50*Math.random();
                    bulletComponent.damage=1;
                    bulletComponent.direction = cc.v2(
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1
                    ).normalizeSelf();

                    // 设置弹幕的 move 方法
                    bulletComponent.move = (dt) => {
                        bulletNode.x += bulletComponent.direction.x * dt * bulletComponent.speed;
                        bulletNode.y += bulletComponent.direction.y * dt * bulletComponent.speed;
                    };
                }
                // 生成中玉弹幕
                const mediumJadePrefab = bulletNumbers[1];
                for (let i = 0; i < 50; i++) {
                    const bulletNode = cc.instantiate(mediumJadePrefab); // 创建中玉弹幕节点
                    bulletNode.position = this.node.position; // 设置弹幕位置为自机位置
                    bulletNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager");
                    this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                    const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

                    // 设置弹幕移动速度和方向
                    bulletComponent.speed = 100 + 40*Math.random();
                    bulletComponent.direction = cc.v2(
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1
                    ).normalizeSelf();

                    // 设置弹幕的 move 方法
                    bulletComponent.move = (dt) => {
                        bulletNode.x += bulletComponent.direction.x * dt * bulletComponent.speed;
                        bulletNode.y += bulletComponent.direction.y * dt * bulletComponent.speed;
                    };
                }
                // 生成小玉弹幕
                const smallJadePrefab = bulletNumbers[2];
                const enemyPosition = this.node.getPosition(); // 获取敌人位置
                for (let i = 0; i < 40; i++) {
                    const bulletNode = cc.instantiate(smallJadePrefab); // 创建小玉弹幕节点
                    bulletNode.setPosition(enemyPosition.add(cc.v2(Math.random() * 25 - 12, Math.random() * 25 - 12))); // 计算弹幕位置
                    bulletNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager");
                    this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                    const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取小玉组件
                    // 设置弹幕移动速度和方向
                    bulletComponent.speed = 50 + 5*i;
                    bulletComponent.direction = cc.v2(
                        this.playerNode.x - this.node.x,
                        this.playerNode.y - this.node.y
                    ).normalizeSelf();


                    // 设置弹幕的 move 方法
                    bulletComponent.move = (dt) => {
                        bulletNode.x += bulletComponent.direction.x * dt * bulletComponent.speed;
                        bulletNode.y += bulletComponent.direction.y * dt * bulletComponent.speed;
                    };
                }
            }, 2000)
        }

        card2.bulletCallback = () => {
            this._bulletNodes = []; // 清空当前生成的所有弹幕节点
            this._bulletTimerId = setInterval(() => {
                // let genScript = this.bulletManagerNode.getComponent(GenBulletScript)
                // // genScript.genSalvoShot(this.node,bulletNumbers[0],this._bulletNodes,10);
                // genScript.genScatterShot(this.node, bulletNumbers[0], this._bulletNodes, 10, 200);
            }, 2000)
        }

        this._spellCards.push(card1);
        this._spellCards.push(card2);
        this.updateCard()
    }

    update(dt: number) {
        switch (this._state) {
            case EnemyState.MOVE:
                // 处理移动逻辑
                break;
            case EnemyState.SPELLCARD:
                //处理符卡逻辑
                this._spellCardTimer += dt;
                if (this._spellCardTimer >= this._spellCards[this._spellCardIndex].duration) {
                    // 符卡时间结束，回到移动状态
                    this._state = EnemyState.MOVE;
                    this._spellCardTimer = 0;
                    this._hp = 0;
                }
                break;
        }
        this.updateCard();
    }
    // 敌人死亡
    onDie() {
        // 清除弹幕定时器
        clearInterval(this._bulletTimerId);
        // 销毁当前生成的所有弹幕节点
        for (const bulletNode of this._bulletNodes) {
            bulletNode.destroy();
        }
        this.node.destroy();
    }

    // // 进入发射弹幕状态
    private enterSpellCard() {
        this._state = EnemyState.SPELLCARD;
        if (this._spellCards[this._spellCardIndex].runBulletCallBack) {
            this._spellCards[this._spellCardIndex].runBulletCallBack(); // 执行符卡的回调函数
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
                // 清除弹幕定时器
                clearInterval(this._bulletTimerId);
                // 将弹幕回调函数设为空
                this._spellCards[this._spellCardIndex - 1].bulletCallback = null;
                for (const bulletNode of this._bulletNodes) {
                    bulletNode.destroy();
                }
                this.enterSpellCard();
            }
        }
        if (this._spellCardIndex == -1) {
            this._spellCardIndex++;
            this.enterSpellCard();
        }
    }

    onDestroy(): void {
        super.destroy();
            
    }
}
