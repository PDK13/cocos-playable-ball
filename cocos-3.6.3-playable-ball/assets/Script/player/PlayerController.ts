import { _decorator, Component, Vec2, RigidBody2D, Vec3, tween, sp } from 'cc';
import { BaseSpine } from '../base/BaseSpine';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    protected m_rigidbody: RigidBody2D = null;
    protected m_spine: BaseSpine = null;

    //

    protected m_control: boolean = true;

    get Control() {
        return this.m_control;
    }

    set Control(value: boolean) {
        this.m_control = value;
    }

    //

    protected m_big: boolean = false;

    get isBig() {
        return this.m_big;
    }
}