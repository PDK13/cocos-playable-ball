import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node } from 'cc';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('ObjectFlax')
export class ObjectFlax extends Component {

    start() {
        let collider = this.getComponent(BoxCollider2D);      
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        switch (otherCollider.tag) {
            case 100://player
                director.emit(GameEvent.PLAYER_HURT);
                break;
        }
    }

}


