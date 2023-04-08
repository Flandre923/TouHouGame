const {ccclass, property} = cc._decorator;

@ccclass
export default class DropItemMap{
    //敌人类型和掉落物的一个对照表，其中每个敌人对应一个数组。数组中是对象，对象应该包含该物品的名称，预制体，以及掉落的概率百分比;
    private static instance:DropItemMap;
    private static getPrefab(url:string,callback:(prefab:cc.Prefab)=>cc.Prefab):cc.Prefab{
        let prefab = null;
        cc.resources.load(url,cc.Prefab,(error,prefab)=>{
            if(error){
                console.log(error)
                return
            }
            prefab = callback(prefab)
        })
        return prefab;
    }
    @property(cc.Prefab)
    gold:cc.Prefab

    dropItemMap = {}
    ItemPrefabMap = {}


    private constructor(){
        this.dropItemMap = {
            "SmallSripit":[
                {"item":"gold","weight":"100","min_number":"3","max_number":"6"},
                {"item":"gold","weight":"6","min_number":"1","max_number":"1"},
                {"item":"gold","weight":"1","min_number":"1","max_number":"1"},
            ],
        }

        this.ItemPrefabMap ={
            "gold":DropItemMap.getPrefab('Prefabs/Gold',(prefab)=>{
                return prefab
            })
        }
    }

    public static getInstance():DropItemMap{
        if(!this.instance){
            this.instance = new DropItemMap();
        }
        return this.instance;
    }
}
