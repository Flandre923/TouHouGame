import BulletPrefab from "./BulletScript/BulletPrefabs";
import GenBulletScript from "./BulletScript/GenBulletScript";
import SmallJadeScript from "./BulletScript/SmallJadeScirpt";
import { AbSpellCard } from "./CradScript/SpellCard";
import EnemyManager from "./EnemyManager";

const { ccclass, property } = cc._decorator;

enum EnemyState {
    MOVE, // 移动状态
    SPELLCARD // 发射弹幕状态
}

@ccclass
export default class LingMengBoss extends cc.Component {

    // 基本属性
    private _hp: number;
    private _maxHp: number = 1000;
    private _name: string;
    private _speed: number;
    private _score: number;

    // 其他的属性
    private _state: EnemyState; // 当前状态
    private _spellCardIndex: number; // 当前符卡的索引
    private _spellCardTimer: number; // 符卡持续时间计时器
    private _spellCardShotTimer: number;// 符卡波次射击计时器
    // 定义变量保存弹幕定时器 ID 和当前生成的所有弹幕节点
    private _bulletTimerId: number;
    private _bulletNodes: cc.Node[] = [];
    currentDown: Function;

    // 符卡
    _spellCards: AbSpellCard[];


    protected onLoad(): void {
        this._hp = this._maxHp;
        this.updateHealthBar();
    }

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
        this._spellCardShotTimer = 0;
        // // 符卡初始化
        this._spellCards = [];
        let bulletPrefabScript = this.node.parent.getComponent(EnemyManager).bulletManager.getComponent(BulletPrefab)
        let playerNode = this.node.parent.getComponent(EnemyManager).player
        let card1 = new AbSpellCard("[想起]户隐山之投", 5, [bulletPrefabScript.bigJadePrefab, bulletPrefabScript.mediumJadePrefab, bulletPrefabScript.smallJadePrefab]);
        let card2 = new AbSpellCard("[赛符]天上天下之照国", 100, [bulletPrefabScript.riceBulletPrefab,bulletPrefabScript.arrowBulletPrefab]);
        let bulletNumbers = card1.bulletNumbers
        // this._bulletNodes = []; // 清空当前生成的所有弹幕节点
        card1.bulletCallback = (dt) => {
            // this._bulletTimerId = setInterval(() => {
            if(Math.floor(dt) %  80 !== 0){
                return;
            }

            // 生成大玉
            const bigJadePrefab = card1.bulletNumbers[0];
            for (let i = 0; i < 30; i++) {
                const bulletNode = cc.instantiate(bigJadePrefab); // 创建大玉弹幕节点
                bulletNode.position = this.node.position; // 设置弹幕位置为自机位置
                bulletNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager"); // 将弹幕节点添加到弹幕管理节点
                this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

                // 设置弹幕移动速度和方向
                bulletComponent.speed = 120 + 50 * Math.random();
                bulletComponent.damage = 1;
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
            const mediumJadePrefab = card1.bulletNumbers[1];
            for (let i = 0; i < 50; i++) {
                const bulletNode = cc.instantiate(mediumJadePrefab); // 创建中玉弹幕节点
                bulletNode.position = this.node.position; // 设置弹幕位置为自机位置
                bulletNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager");
                this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

                // 设置弹幕移动速度和方向
                bulletComponent.speed = 100 + 40 * Math.random();
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
            const smallJadePrefab = card1.bulletNumbers[2];
            const enemyPosition = this.node.getPosition(); // 获取敌人位置
            for (let i = 0; i < 40; i++) {
                const bulletNode = cc.instantiate(smallJadePrefab); // 创建小玉弹幕节点
                bulletNode.setPosition(enemyPosition.add(cc.v2(Math.random() * 25 - 12, Math.random() * 25 - 12))); // 计算弹幕位置
                bulletNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager");
                this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取小玉组件
                // 设置弹幕移动速度和方向
                bulletComponent.speed = 50 + 5 * i;
                bulletComponent.direction = cc.v2(
                    playerNode.x - this.node.x,
                    playerNode.y - this.node.y
                ).normalizeSelf();


                // 设置弹幕的 move 方法
                bulletComponent.move = (dt) => {
                    bulletNode.x += bulletComponent.direction.x * dt * bulletComponent.speed;
                    bulletNode.y += bulletComponent.direction.y * dt * bulletComponent.speed;
                };
            }
            // }, 2000)
        }


        let w = 0;
        let angle = 0;
        card2.bulletCallback = (dt) => {
            let arrowBulletPrefab = card2.bulletNumbers[1];
            if(dt % 4 == 0){
                // let i = dt / 20;
                let i=0;
                for(i=angle;i<2*Math.PI + angle;i+=2*Math.PI/5){
                        const bulletNode = cc.instantiate(arrowBulletPrefab); // 创建箭头
                        bulletNode.setPosition(this.node.getPosition()); // 计算弹幕位置
                        bulletNode.parent = this.node.parent.parent.getChildByName("EnemyBulletManager");
                        this._bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
                        const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取小玉组件
                        // 设置弹幕移动速度和方向
                        bulletComponent.speed = 100;
                    if(Math.abs(i-angle)<0.1){
                    }else{
                        bulletNode.color = cc.Color.CYAN
                    }
                    bulletComponent.direction = cc.v2(
                        0.5 * Math.sin(i),
                        0.5 * Math.cos(i)
                    ).normalizeSelf();
                    // 设置弹幕的 move 方法
                    bulletComponent.move = (dt) => {
                        bulletNode.x += bulletComponent.direction.x * dt * bulletComponent.speed;
                        bulletNode.y += bulletComponent.direction.y * dt * bulletComponent.speed;
                    };
                }

            }
            angle += w;
            w += 0.0015;
            
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
                this._spellCardShotTimer += 1;
                this.enterSpellCard(this._spellCardShotTimer);
                if(this._spellCardShotTimer > 180){
                    // this._spellCardShotTimer = 0;
                }
                if (this._spellCardTimer >= this._spellCards[this._spellCardIndex].duration) {
                    // 符卡时间结束，回到移动状态
                    // this._state = EnemyState.MOVE;
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
        // clearInterval(this._bulletTimerId);
        // 销毁当前生成的所有弹幕节点
        this.deleteGenBullet()
        this.currentDown();
        this.node.destroy();
        const healthBarForeground = this.node.parent.getComponent(EnemyManager).uiNodes[0].active = false;

    }

    onHit(damage: number) {
        this._hp -= damage;
        this.updateHealthBar();
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
                // 将弹幕回调函数设为空
                this._spellCards[this._spellCardIndex - 1].bulletCallback = null;
                this.deleteGenBullet()
            }
        }
        if (this._spellCardIndex == -1) {
            this._spellCardIndex++;
        }
    }

    updateHealthBar() {
        const healthBarForeground = this.node.parent.getComponent(EnemyManager).uiNodes[0].getChildByName("BossHpBarForegorud");
        const healthPercentage = this._hp / this._maxHp;
        healthBarForeground.parent.active = true;
        healthBarForeground.width = 500 * healthPercentage;
    }

    deleteGenBullet(){
        const bullets = this.node.parent.parent.getChildByName("EnemyBulletManager").children;
        for (let bullet of bullets) {
            bullet.destroy();
        }
    }

    public get score() {
        return this._score;
    }

    onDestroy(): void {
        super.destroy();

    }


}
