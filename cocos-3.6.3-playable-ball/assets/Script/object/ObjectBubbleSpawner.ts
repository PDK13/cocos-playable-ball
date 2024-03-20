import { _decorator, CCFloat, Component, instantiate, Node } from 'cc';
import { ObjectBubble } from './ObjectBubble';
const { ccclass, property } = _decorator;

@ccclass('ObjectBubbleSpawner')
export class ObjectBubbleSpawner extends Component {

    @property(CCFloat)
    duration = 5;

    @property(CCFloat)
    speed = -0.8;

    @property(Node)
    bubbleSample: Node = null;

    start() {
        this.spawn();
        setInterval(()=>{
            this.spawn();
        }, this.duration*1000);
    }

    spawn()
    {
        let bubble = instantiate(this.bubbleSample);
        bubble.setParent(this.node.parent);
        bubble.position = this.node.getPosition();
        let bubbleComp = bubble.getComponent(ObjectBubble);
        bubbleComp.init(this.speed);
        bubble.active = true;
    }
}


