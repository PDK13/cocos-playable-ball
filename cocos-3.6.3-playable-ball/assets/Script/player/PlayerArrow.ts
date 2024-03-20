import { _decorator, CCFloat, Component, director, Node, v3, Vec3 } from 'cc';
import { PlayerController } from './PlayerController';
import GameEvent from '../GameEvent';
import CameraMovement from '../game/CameraMovement';
const { ccclass, property } = _decorator;

@ccclass('PlayerArrow')
export class PlayerArrow extends Component {
    @property(CCFloat)
    offsetPosY: number = 40;

    @property(PlayerController)
    ballR: PlayerController = null;

    @property(Node)
    arrowR: Node = null;

    @property(PlayerController)
    ballB: PlayerController = null;

    @property(Node)
    arrowB: Node = null;

    @property(CameraMovement)
    camera: CameraMovement = null;

    targetCurrent: PlayerController = null;

    start() {
        this.targetCurrent = this.ballR;
        this.ballB.onControl(false);
        this.camera.onTargetSwitch(this.ballR.node);
        this.arrowR.active = true;
        this.arrowB.active = false;
        //
        director.on(GameEvent.PLAYER_SWITCH, this.onSwitch, this);
    }

    update(deltaTime: number) {
        if (this.targetCurrent == null)
            return;
        var PosCurrent = this.targetCurrent.node.position;
        PosCurrent.add(v3(0, this.offsetPosY, 0));
        this.node.position = PosCurrent;
    }

    //

    private onSwitch() {
        this.targetCurrent = this.targetCurrent == this.ballR ? this.ballB : this.ballR;
        this.ballR.onControl(this.targetCurrent == this.ballR);
        this.ballB.onControl(this.targetCurrent == this.ballB);
        this.camera.onTargetSwitch(this.targetCurrent.node);
        this.arrowR.active = this.targetCurrent == this.ballR;
        this.arrowB.active = this.targetCurrent == this.ballB;
    }
}