import { _decorator, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, v2 } from 'cc';
import { BaseSpineCustom } from '../base/BaseSpineCustom';
const { ccclass, property } = _decorator;

@ccclass('ObjectBounceJelly')
export class ObjectBounceJelly extends Component {

    @property(CCInteger)
    force: number = 100;

    readonly ANIM_IDLE: string = 'idle';
    readonly ANIM_JUMP: string = 'jump';

    @property(CCInteger)
    contactSelf: number = 0;

    @property(CCInteger)
    contactOther: number = 0;

    spine: BaseSpineCustom = null;

    protected onLoad(): void {
        this.spine = this.getComponent(BaseSpineCustom);
        //
        let colliders = this.getComponents(Collider2D);
        colliders.forEach(c => {
            c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        })
    }

    protected start(): void {
        this.spine.SetAnim(this.ANIM_IDLE, true);
    }

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (selfCollider.tag == this.contactSelf && otherCollider.tag == this.contactOther) {
            var Body = otherCollider.body;
            if (Body == null)
                return;
            Body.linearVelocity = v2(Body.linearVelocity.x, this.force);
            //
            this.scheduleOnce(() =>
                this.spine.SetAnim(this.ANIM_IDLE, true), this.spine.SetAnim(this.ANIM_JUMP, false));
        }
    }
}