import { _decorator, CCFloat, Component, Node } from 'cc';
import { BaseObject } from '../base/BaseObject';
const { ccclass, property } = _decorator;

@ccclass('CutsceneBallWSplitSkin')
export class CutsceneBallWSplitSkin extends Component {

    @property(CCFloat)
    DelaySwitch: number = 2;

    @property(BaseObject)
    Light01: BaseObject = null;

    @property(BaseObject)
    Light02: BaseObject = null;

    @property(Node)
    Camera01: Node = null;

    @property(Node)
    Camera02: Node = null;

    protected start(): void {
        this.Light01.SetTweenRotateLoop(360, 3, 0);
        this.Light02.SetTweenRotateLoop(360, 3, 0);
        //
        this.Camera01.active = false;
        this.Camera02.active = false;
        //
        this.SetLightDarkLoop(true);
    }

    private SetLightDarkLoop(Active01: boolean): void {
        this.Camera01.active = Active01;
        this.Camera02.active = !Active01;
        this.scheduleOnce(() => this.SetLightDarkLoop(!Active01), this.DelaySwitch);
    }
}