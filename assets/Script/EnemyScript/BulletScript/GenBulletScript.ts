import SmallJadeScript from "./SmallJadeScirpt";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GenBulletScript extends cc.Component {


    // 齐射弹幕，移动随机，生成算法
    genSalvoShot(enemy:cc.Node,bulletPrefab:cc.Prefab,bulletNodes:Array<cc.Node>,genNumber:number){
        for (let i = 0; i < genNumber; i++) {
            const bulletNode = cc.instantiate(bulletPrefab); // 创建大玉弹幕节点
            bulletNode.position = enemy.position; // 设置弹幕位置为自机位置
            bulletNode.parent = this.node; // 将弹幕节点添加到弹幕管理节点
            bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
            const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

            // 设置弹幕移动速度和方向
            bulletComponent.speed = 120;
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
    }
    // 散射 随机 生成算法
    genScatterShot(enemy:cc.Node,bulletPrefab:cc.Prefab,bulletNodes:Array<cc.Node>,genNumber:number,scatterGap:number){
        let timer = 0;
        let intervalId = setInterval(()=>{
            if(timer > genNumber){
                clearInterval(intervalId);
            }
            const bulletNode = cc.instantiate(bulletPrefab); // 创建大玉弹幕节点
            bulletNode.position = enemy.position; // 设置弹幕位置为自机位置
            bulletNode.parent = this.node; // 将弹幕节点添加到弹幕管理节点
            bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
            const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

            // 设置弹幕移动速度和方向
            bulletComponent.speed = 120;
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

            timer++;
        },scatterGap)
    }


    genScatterShotMove(enemy:cc.Node,bulletPrefab:cc.Prefab,bulletNodes:Array<cc.Node>,genNumber:number,scatterGap:number,move:(dt)=>void){
        let timer = 0;
        let intervalId = setInterval(()=>{
            if(timer > genNumber){
                clearInterval(intervalId);
            }
            const bulletNode = cc.instantiate(bulletPrefab); // 创建大玉弹幕节点
            bulletNode.position = enemy.position; // 设置弹幕位置为自机位置
            bulletNode.parent = this.node; // 将弹幕节点添加到弹幕管理节点
            bulletNodes.push(bulletNode); // 将弹幕节点添加到数组中
            const bulletComponent = bulletNode.getComponent(SmallJadeScript); // 获取弹幕组件

            // 设置弹幕移动速度和方向
            bulletComponent.speed = 120;
            bulletComponent.damage=1;
            bulletComponent.direction = cc.v2(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalizeSelf();

            // 设置弹幕的 move 方法
            bulletComponent.move = move;

            timer ++; 
        },scatterGap)
    }

}
