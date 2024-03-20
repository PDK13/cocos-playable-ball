import { _decorator, Animation, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D, tween, v3 } from 'cc';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('ObjectBubble')
export class ObjectBubble extends Component {

    m_stop: boolean = false;
    m_active: boolean = false;

    onLoad() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            //collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {      
        if(this.m_stop)
            return;         
        switch(otherCollider.tag)
        {
            case -1://ground                
            case 50://monster
            case 60://flax
                if(!this.m_active)
                    return;
                this.m_stop = true;
                setTimeout(() => {
                    this.node.destroy();
                }, 1);
                break;
            case 100://player     
                this.m_stop = true;  
                setTimeout(() => {
                    this.getComponent(RigidBody2D).gravityScale = 0;
                    director.emit(GameEvent.PLAYER_BUBBLE, this.node.worldPosition.clone());
                }, 1);                           
                this.getComponent(RigidBody2D).sleep();
                setTimeout(() => {
                    this.node.destroy();
                }, 200);
                break;
        }
    }

    init(speed: number)
    {
        let anim = this.getComponent(Animation);
        this.getComponent(RigidBody2D).gravityScale = speed;        
        tween(this.node).to(0.2, {scale: v3(1, 1, 1)}).call(()=>{
            anim.play();
        }).start();
        this.scheduleOnce(()=>{
            this.m_active = true;
        }, 1);
    }
}


