
const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletPrefab extends cc.Component {
    @property(cc.Prefab)
    bigJadePrefab: cc.Prefab;
    @property(cc.Prefab)
    mediumJadePrefab: cc.Prefab;
    @property(cc.Prefab)
    smallJadePrefab: cc.Prefab;

}
