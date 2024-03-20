import { _decorator, CCBoolean, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { BaseSpine } from '../base/BaseSpine';
const { ccclass, property } = _decorator;

@ccclass('ObjectBlockNote')
export class ObjectBlockNote extends Component {

    readonly ANIM_IDLE_1 = 'idle';
    readonly ANIM_CONTACT_1 = 'attack2';
    readonly ANIM_CONTACT_2 = 'attack2_1_2';
    readonly ANIM_CONTACT_HOLD = 'attack2_2';
    readonly ANIM_CONTACT_3 = 'attack2_3';
    readonly ANIM_IDLE_2 = 'idle2';

    @property(CCBoolean)
    activeOnStart: boolean = false;

    @property(CCInteger)
    contactSelf: number = 0;

    @property(CCInteger)
    contactOther: number = 0;

    spine: BaseSpine = null;
    contact: boolean = false;
    active: boolean = false;

    protected onLoad(): void {
        this.spine = this.getComponent(BaseSpine);
        //
        let colliders = this.getComponents(Collider2D);
        colliders.forEach(c => {
            c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            c.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        })
    }

    protected start(): void {
        this.spine.SetAnim(!this.activeOnStart ? this.ANIM_IDLE_1 : this.ANIM_IDLE_2, true);
        this.spine.SetTimeScale(2);
    }

    //

    private SetBlockContactOn(): void {
        this.unscheduleAllCallbacks();
        //
        this.scheduleOnce(() => {
            this.spine.SetAnim(this.ANIM_CONTACT_HOLD, true)
        }, this.spine.SetAnim(!this.contact ? this.ANIM_CONTACT_1 : this.ANIM_CONTACT_2, false));
        //
        this.contact = true;
    }

    private SetBlockContactOff(): void {
        this.unscheduleAllCallbacks();
        //
        this.scheduleOnce(() => {
            this.scheduleOnce(() => {
                this.spine.SetAnim(this.ANIM_IDLE_2, true)
            }, this.spine.SetAnim(this.ANIM_CONTACT_3, false));
        }, 0.1);
    }

    //

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (selfCollider.tag == this.contactSelf && otherCollider.tag == this.contactOther) {
            this.active = true;
            this.SetBlockContactOn();
        }
    }

    protected onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (!this.active)
            return;
        //
        this.active = false;
        //
        this.SetBlockContactOff();
    }
}