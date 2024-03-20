import { _decorator, AudioSource, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D, tween, v2, v3 } from 'cc';
import { PlayerController } from '../player/PlayerController';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('MonsterStatic')
export class MonsterStatic extends Component {

    @property(AudioSource)
    audio: AudioSource = null;
    
    m_stop: boolean = false;

    protected onLoad(): void {
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
        let worldPos = this.node.worldPosition;        
        switch(otherCollider.tag)
        {
            case 100://player              
                let direction = worldPos.subtract( otherCollider.node.worldPosition);
                let directionV2 = v2(direction.x, direction.y);
                let player = otherCollider.node.getComponent(PlayerController);                 
                if(player != null)      
                {
                    if(player.isBig)
                    {
                        this.m_stop = true;
                        this.getComponent(RigidBody2D).sleep();
                        this.getComponent(Collider2D).sensor = true;
                        this.audio.play();
                        let directMove = v3();
                        if(direction.x > 0)
                            directMove = v3(1, 1, 0);
                        else
                            directMove = v3(-1, 1, 0);
                        tween(this.node).to(1, {position: directMove.multiplyScalar(5000)}).call(()=>{this.node.destroy()}).start();
                    }
                    else       
                    {
                        director.emit(GameEvent.PLAYER_HURT);   
                        player.addForce(directionV2.normalize().multiplyScalar(-100));         
                    }
                }
                break;
        }
    }
}


