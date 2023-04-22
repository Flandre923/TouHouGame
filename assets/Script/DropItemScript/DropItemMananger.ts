import DropItemMap from "./DropoItemMap";
import PPointScript from "./PPointScript";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DropItemManager extends cc.Component {

    dropItemMap: DropItemMap;
    // 保底触发概率
    pitySystem: Record<string,number>={};
    // 生成掉落物
    genDropItem(enemyType, enemy: cc.Node) {
        let dropItemList = this.dropItemMap.dropItemMap[enemyType];

        for (let item of dropItemList) {
            let weight = item.weight
            let min_number = item.min_number
            let max_number = item.max_number
            let numberCount = Math.floor(Math.random() * (max_number - min_number ))+ min_number;
            // if(!this.pitySystem[item['item']]){
            //     this.pitySystem[item['item']] = weight
            // }else{
            //     this.pitySystem[item['item']] += weight
            // }
            // // 如果 weight 大于 100 就触发保底
            // if (this.pitySystem[item['item']] >= 100) {
            //     this.genItem(numberCount, enemy, item);
            //     return;
            // }
            // 如果生成概率落在为了weight的百分比中
            if ( Math.random() * 100 <= weight ){
                this.genItem(numberCount, enemy, item)
                // 如果物品已经生成就清空保底
                this.pitySystem[item['item']] = 0;
            }else{
                if(!this.pitySystem[item['item']]){
                    this.pitySystem[item['item']] = weight
                }else{
                    this.pitySystem[item['item']] += weight
                }
                // 如果 weight 大于 100 就触发保底
                if (this.pitySystem[item['item']] >= 100) {
                    this.genItem(numberCount, enemy, item);
                    return;
                }
            }
        }
    }
    private genItem(numberCount: number, enemy: cc.Node, item: Record<string, string>) {
        for (let i = 0; i < numberCount; i++) {
            let dropItemName = item['item']
            let dropItem = cc.instantiate(this.dropItemMap.ItemPrefabMap[dropItemName])
            this.setItem(dropItem, enemy)
        }
    }
    // 给生成的Item设置属性
    setItem(dropItem: cc.Node, enemy: cc.Node) {
        dropItem.parent = this.node;

        // 计算物品掉落的位置，随机范围为 [-25, 25]。
        let offsetX = Math.floor(Math.random() * 51) - 25;
        let offsetY = Math.floor(Math.random() * 51) - 25;
        let position = enemy.getPosition().add(cc.v2(offsetX, offsetY));
        dropItem.setPosition(position);
    }


    // onLoad () {}

    start() {
        this.dropItemMap = DropItemMap.getInstance()
    }

    // update (dt) {}

}
