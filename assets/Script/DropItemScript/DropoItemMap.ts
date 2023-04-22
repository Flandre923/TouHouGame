const { ccclass, property } = cc._decorator;

@ccclass
export default class DropItemMap {
    private static instance: DropItemMap;

    private static async getPrefab(url: string): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.resources.load(url, cc.Prefab, (error, prefab) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(prefab);
                }
            });
        });
    }

    dropItemMap: Record<any, any>;
    ItemPrefabMap: Record<string, cc.Prefab>;

    private constructor() {

        this.dropItemMap = {
            "SmallSpirit": [
                { "item": "Ppoint", "weight": 100, "min_number": 3, "max_number": 6 },
                { "item": "Bomb", "weight":6, "min_number": 1, "max_number": 1 },
                { "item": "Hp", "weight": 10, "min_number": 1, "max_number": 1 },
            ]
        }

        
        Promise.all([
            DropItemMap.getPrefab('Prefab/DropItemPrefab/Bomb'),
            DropItemMap.getPrefab('Prefab/DropItemPrefab/Hp'),
            DropItemMap.getPrefab('Prefab/DropItemPrefab/Ppoint')
        ]).then(([bombPrefab, hpPrefab, ppointPrefab]) => {
            this.ItemPrefabMap = {
                "Bomb": bombPrefab,
                "Hp": hpPrefab,
                "Ppoint": ppointPrefab
            };
        }).catch((error) => {
            console.log(error);
        });
    }

    public static getInstance(): DropItemMap {
        if (!this.instance) {
            this.instance = new DropItemMap();
        }
        return this.instance;
    }
}
