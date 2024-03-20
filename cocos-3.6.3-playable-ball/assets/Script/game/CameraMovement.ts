import { _decorator, Component, Node, Vec3, v3, Camera, CCFloat, director, tween, Tween, AudioSource, CCBoolean, Vec2, v2 } from 'cc';
import { BackgroundParallax } from './BackgroundParallax';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('CameraMovement')
export default class CameraMovement extends Component {

    @property(CCFloat)
    smoothTime = 0.1;

    @property(Vec2)
    offset: Vec2 = v2(0, 0);

    //

    @property(CCBoolean)
    lockX: boolean = false;

    @property(CCBoolean)
    lockY: boolean = false;

    //

    @property(CCBoolean)
    limit: boolean = false;

    @property(Vec2)
    limitMax: Vec2 = v2(1000, 1000);

    @property(Vec2)
    limitMin: Vec2 = v2(-1000, -1000);

    //

    @property(CCBoolean)
    paralax: boolean = true;

    @property(Node)
    player: Node | null = null;

    @property(Node)
    background: Node | null = null;

    m_parallaxes: BackgroundParallax[] = [];

    m_lock: Vec3;
    m_target: Vec3;
    m_stop: boolean = false;
    m_finishPos: Vec3;
    m_targetY: number = 0;
    m_syncY: boolean = false;

    onLoad() {
        director.on(GameEvent.PLAYER_STOP, this.onFinish, this);
        director.on(GameEvent.PLAYER_X4, this.onPlayerX4, this);
        director.on(GameEvent.PLAYER_GROUND, this.onPlayerGround, this);
        director.on(GameEvent.PLAYER_BUBBLE, this.onPlayerBubble, this);
        director.on(GameEvent.PLAYER_NORMAL, this.onPlayerNormal, this);
        //director.on(GameEvent.PLAYER_FLAG, this.onPlayerFlag, this);
        //
        this.m_parallaxes = this.getComponentsInChildren(BackgroundParallax);
        //
        if (this.lockX || this.lockY)
            this.m_lock = this.node.position.clone();
    }

    start() {
        this.m_target = this.node.position.clone();
        let cam = this.getComponent(Camera);
        let ratio = 540 / cam.orthoHeight;
        this.background.scale = new Vec3(2 / ratio, 2 / ratio, 1);
    }

    lateUpdate(dt: number) {
        let target = v3();
        if (this.m_stop) {
            target = this.m_finishPos;
            this.m_target = this.m_target.lerp(target, this.smoothTime);
            this.node.worldPosition = this.m_target;
        }
        else {
            target = this.player.position.clone();
            //
            if (this.m_syncY)
                this.m_targetY = target.y;
            else {
                //if ((this.m_targetY - target.y) > 100)
                //    this.m_targetY = target.y;
                //
                target.y = this.m_targetY + 300;
            }
            //
            //LOCK:
            if (this.lockX)
                target.x = this.m_lock.x;
            if (this.lockY)
                target.y = this.m_lock.y;
            //
            //LIMIT:
            if (this.limit) {
                if (target.x > this.limitMax.x)
                    target.x = this.limitMax.x;
                else
                    if (target.x < this.limitMin.x)
                        target.x = this.limitMin.x;

                if (target.y > this.limitMax.y)
                    target.y = this.limitMax.y;
                else
                    if (target.y < this.limitMin.y)
                        target.y = this.limitMin.y;
            }
            //
            target.x += this.offset.x;
            target.y += this.offset.y;
            //
            this.m_target = this.m_target.lerp(target, this.smoothTime);
            this.node.position = this.m_target;
        }
        //
        if (this.paralax) {
            this.m_parallaxes.forEach(element => {
                element.excute();
            });
        }
    }

    onPlayerFlag() {
        Tween.stopAllByTarget(this.node);
        this.node.eulerAngles = v3();
        if (this.getComponent(AudioSource) != null)
            this.getComponent(AudioSource).stop();
    }

    onFinish(position: Vec3) {
        this.m_stop = true;
        this.m_finishPos = position.clone();
        this.m_target = this.node.worldPosition;
        Tween.stopAllByTarget(this.node);
        this.node.eulerAngles = v3();
        if (this.getComponent(AudioSource) != null)
            this.getComponent(AudioSource).stop();
    }

    onPlayerX4(active: boolean) {
        if (active) {
            let rotate1 = tween(this.node).to(0.025, { eulerAngles: v3(0, 0, 0.5) });
            let rotate2 = tween(this.node).to(0.025, { eulerAngles: v3(0, 0, -0.5) });
            tween(this.node).sequence(rotate1, rotate2).repeatForever().start();
        }
    }

    onPlayerGround(targetY: number) {
        this.m_targetY = targetY;
    }

    onPlayerBubble() {
        this.m_syncY = true;
    }

    onPlayerNormal() {
        this.m_syncY = false;
    }

    onTargetSwitch(target: Node) {
        this.player = target;
    }
}
