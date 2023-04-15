import DropItemMap from "./DropoItemMap";
import PPointScript from "./PPointScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DropItemManager extends cc.Component {

    dropItemMap:DropItemMap;
    // 生成掉落物
    genDropItem(enemyType,enemy:cc.Node){
        let dropItemList = this.dropItemMap.dropItemMap[enemyType];
        for(let item of dropItemList){
            let weight  = item.weight/100
            let min_number = item.min_number
            let max_number = item.max_number
            let number = Math.floor(Math.random() * (max_number - min_number + 2));
            // 如果生成概率落在为了weight的百分比中
            if(Math.random()<=weight){
                for(let i =0;i<number;i++){
                    let dropItemName = item['item']
                    let dropItem = cc.instantiate(this.dropItemMap.ItemPrefabMap[dropItemName])
                    this.setItem(dropItem,enemy)
                }
            }
        }
    }

    // 给生成的Item设置属性
    setItem(dropItem:cc.Node,enemy:cc.Node){
        dropItem.parent = this.node;

        // 计算物品掉落的位置，随机范围为 [-25, 25]。
        let offsetX = Math.floor(Math.random() * 51) - 25;
        let offsetY = Math.floor(Math.random() * 51) - 25;
        let position = enemy.getPosition().add(cc.v2(offsetX, offsetY));
        dropItem.setPosition(position);
    }


    // onLoad () {}

    start () {
        this.dropItemMap = DropItemMap.getInstance()
    }

    // update (dt) {}

}
