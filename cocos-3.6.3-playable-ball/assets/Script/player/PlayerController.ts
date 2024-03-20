import { _decorator, Component, Vec2, RigidBody2D, Vec3, tween, sp } from 'cc';
import { BaseSpine } from '../base/BaseSpine';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    rigidbody: RigidBody2D = null;
    spine: BaseSpine = null;

    m_control: boolean = true;
    m_grounded: boolean = false;
    m_baseScale: Vec3 = Vec3.ONE;
    m_ratioSize: number = 1;
    m_finish: boolean = false;
    m_immortal: boolean = false;

    get isBig() {
        return this.m_ratioSize > 1;
    }

    onControl(Control: boolean) {
        this.m_control = Control;
    }

    onX4(active: boolean) {
        let ratio = active ? 4 : 1;
        tween(this.node).to(0.25, { scale: this.m_baseScale.multiplyScalar(ratio) }).start();
        this.m_ratioSize = ratio;
    }

    addForceY(force: number) {
        let veloc = this.rigidbody.linearVelocity;
        veloc.y = force;
        this.rigidbody.linearVelocity = veloc;
        //
        this.m_grounded = false;
    }

    addForce(force: Vec2) {
        this.rigidbody.linearVelocity = force;
    }
}