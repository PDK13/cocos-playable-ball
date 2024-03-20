import { _decorator, CCString, sp } from 'cc';
import { BaseSpine } from './BaseSpine';
const { ccclass, property } = _decorator;
const { spine } = sp;

@ccclass('BaseSpineCustom')
export class BaseSpineCustom extends BaseSpine {

    @property(sp.SkeletonData)
    Skeleton: sp.SkeletonData = null;

    @property([CCString])
    Skin: string[] = ["1", "w1"];

    protected onLoad(): void {
        this.SetSekeleton(this.Skeleton);
        this.SetSkin(this.Skin);
    }

    //

    public SetSekeleton(Data: sp.SkeletonData): void {
        this.Skeleton = Data;
        this.spine.skeletonData = Data;
    }

    public SetSkin(...Skin: any[]){
        this.Skin = Skin;
        //
        let BaseSkin = new spine.Skin('base-char');
        let BaseData = this.spine._skeleton.data;
        //
        Skin.forEach(item => {
            BaseSkin.addSkin(BaseData.findSkin(item));
        });
        //
        this.spine._skeleton.setSkin(BaseSkin);
        this.spine._skeleton.setSlotsToSetupPose();
        this.spine.getState().apply(this.spine._skeleton);
    }
}