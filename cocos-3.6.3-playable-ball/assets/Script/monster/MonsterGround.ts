import { _decorator, AudioSource, CCFloat, Collider2D, Component, Contact2DType, director, ERigidBody2DType, IPhysics2DContact, Node, RigidBody2D, sp, tween, v2, v3, Vec2 } from 'cc';
import GameEvent from '../GameEvent';
import { PlayerController } from '../player/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('MonsterGround')
export class MonsterGround extends Component {

    @property(CCFloat)
    velocX = 100;

    @property(RigidBody2D)
    rigidbody: RigidBody2D = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(AudioSource)
    audio: AudioSource = null;

    m_isRight: boolean = false;
    m_stop: boolean = false;
    colliders: Collider2D[];

    protected onLoad(): void {
        this.colliders = this.getComponents(Collider2D);
        if (this.colliders) {
            this.colliders.forEach(collider =>{
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                //collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            })            
        }
    }

    update(dt: number)
    {
        if(this.m_stop)
            return;
        let veloc = this.rigidbody.linearVelocity;
        if(this.m_isRight)
            veloc.x = this.velocX;
        else
            veloc.x = -this.velocX;
        this.rigidbody.linearVelocity = veloc;
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        if(this.m_stop)
            return;
        let worldPos = this.node.worldPosition;        
        switch(otherCollider.tag)
        {
            case -1://ground
                if(selfCollider.tag == 11)//left,right
                    this.m_isRight = !this.m_isRight;    
                break;
            case 100://player  
                let player = otherCollider.node.getComponent(PlayerController); 
                if(player != null)
                {
                    let direction = worldPos.subtract(otherCollider.node.worldPosition);   
                    if(player.isBig)
                    {
                        this.m_stop = true;
                        this.rigidbody.sleep();
                        this.colliders.forEach(collider =>{
                            collider.sensor = true;
                        })  
                        this.audio.play();
                        let directMove = v3();
                        if(direction.x > 0)
                            directMove = v3(1, 1, 0);
                        else
                            directMove = v3(-1, 1, 0);
                        tween(this.node).to(1, {position: directMove.multiplyScalar(5000)}).call(()=>{this.node.destroy()}).start();
                    }else
                    {
                        if(selfCollider.tag == 12)//top
                        {
                            this.m_stop = true;
                            this.audio.play();
                            let entry = this.spine.setAnimation(0, 'dead', false);
                            this.rigidbody.sleep();
                            this.scheduleOnce(()=>{
                                this.node.destroy();
                            }, entry.animationEnd);

                        }else
                        {                             
                            let directionV2 = v2(direction.x, direction.y);                            
                            director.emit(GameEvent.PLAYER_HURT);
                            player.addForce(directionV2.normalize().multiplyScalar(-100));     
                            //
                            if(selfCollider.tag == 11)//left,right
                                this.m_isRight = !this.m_isRight;                   
                        }
                    }
                }                
                break;
        }
    }
}