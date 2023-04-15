const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletPrefab {
    private static _instance: BulletPrefab = null;
    private _bigJadePrefab: cc.Prefab | null = null;
    private _mediumJadePrefab: cc.Prefab | null = null;
    private _smallJadePrefab: cc.Prefab | null = null;
    private _url = "Prefab/BulletPrefabs"

    private constructor() {
        cc.resources.load(this._url+"/Big_Jade", cc.Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            this._bigJadePrefab = prefab;
            console.log("big jade prefab loaded");
        });

        cc.resources.load(this._url + "/Medium_Jade", cc.Prefab, (err, prefab) => {
            if (err) {
                console.error(err.message);
                return;
            }
            this._mediumJadePrefab = prefab;
            console.log("medium jade prefab loaded");
        });

        cc.resources.load(this._url + "/Small_Jade", cc.Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            this._smallJadePrefab = prefab;
            console.log("small jade prefab loaded");
        });



    }

    public static get instance(): BulletPrefab {
        return BulletPrefab._instance;
    }

    public get bigJadePrefab(): cc.Prefab | null {
        if (!this._bigJadePrefab) {
            this._bigJadePrefab = cc.resources.get(this._url+"/Big_Jade", cc.Prefab);
            return this._bigJadePrefab
          }
        return this._bigJadePrefab;

    }
    public get mediumJadePrefab(): cc.Prefab | null {
        return this._bigJadePrefab;
    }
    public get smallJadePrefab(): cc.Prefab | null {
        return this._bigJadePrefab;
    }

}