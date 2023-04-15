// export interface SpellCard {
//     name: string; // 符卡名称
//     duration: number; // 持续时间
//     bulletNumbers:Array<cc.Prefab>; // 使用弹幕预制体数组
//     bulletCallback: () => void; // 发射弹幕的回调函数
// }

export class AbSpellCard{
    private _name: string; // 符卡名称
    private _duration: number; // 持续时间
    private _bulletNumbers:Array<cc.Prefab>; // 使用弹幕预制体数组
    private _bulletCallback: () => void; // 发射弹幕的回调函数

    constructor(name:string,duration:number,bulletNumbers:Array<cc.Prefab>){
        this._name = name;
        this._duration = duration;
        this._bulletNumbers = bulletNumbers;
    }

    set bulletCallback(bulletCallback:()=>void){
        this._bulletCallback = bulletCallback;
    }

    runBulletCallBack(){
        this._bulletCallback();
    }

    get bulletNumbers():Array<cc.Prefab>{
        return this._bulletNumbers;
    }

    get name():string{
        return this._name;
    }

    get duration():number{
        return this._duration;
    }

    
}