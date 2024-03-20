import { _decorator, AudioSource, CCBoolean, CCFloat, CircleCollider2D, Collider2D, Component, Contact2DType, director, ERaycast2DType, IPhysics2DContact, Node, PhysicsSystem2D, Quat, RigidBody2D, sp, tween, v2, v3, Vec2, Vec3 } from 'cc';
import GameEvent from '../GameEvent';
import Loader from '../Loader';
import { PlayerController } from './PlayerController';
import { BaseSpine } from '../base/BaseSpine';
const { ccclass, property } = _decorator;

@ccclass('PlayerControllerBall')
export class PlayerControllerBall extends PlayerController {

    @property(CCFloat)
    xDamping = 40;

    @property(CCFloat)
    airSpeedX = 5;

    @property(CCFloat)
    maxSpeedX = 30;

    @property(CCFloat)
    groundSpeedX = 4000;

    @property(CCFloat)
    jumpForce = 70;

    @property(CCBoolean)
    autoRun = false;

    @property(Node)
    bubble: Node = null;

    @property(AudioSource)
    jumpAudio: AudioSource = null;

    @property(AudioSource)
    hurtAudio: AudioSource = null;

    @property(AudioSource)
    finishAudio: AudioSource = null;

    m_baseRadius: number;
    m_bubbleColider: Collider2D = null;

    onLoad() {
        this.rigidbody = this.getComponent(RigidBody2D);
        this.spine = this.getComponent(BaseSpine);
        //
        let collider = this.getComponent(CircleCollider2D);
        this.m_baseScale = this.node.scale.clone();
        this.m_baseRadius = collider.radius;
        this.m_ratioSize = 1;
        //
        director.on(GameEvent.PLAYER_JUMP, this.onPlayerJump, this);
        director.on(GameEvent.PLAYER_MOVE_LEFT, this.onPlayerMoveLeft, this);
        director.on(GameEvent.PLAYER_MOVE_RIGHT, this.onPlayerMoveRight, this);
        director.on(GameEvent.PLAYER_MOVE_STOP, this.onPlayerMoveStop, this);
        director.on(GameEvent.PLAYER_STOP, this.onPlayerStop, this);
        director.on(GameEvent.PLAYER_HURT, this.onHurt, this);
        director.on(GameEvent.PLAYER_X4, this.onX4, this);
        director.on(GameEvent.PLAYER_BUBBLE, this.onBubble, this);
        //
        let colliders = this.node.getComponents(Collider2D);
        colliders.forEach(c => {
            if (c.tag == 500)
                this.m_bubbleColider = c;
            c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        });

        //physic        
        // if (collider) {
        //     collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     //collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // }
        // if (PhysicsSystem2D.instance) {
        //     PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     //PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // }
    }

    start() {
        this.m_baseMass = this.rigidbody.getMass();
        if (this.autoRun && !Loader.finish)
            this.onPlayerMoveRight();
    }

    //

    onBubble(worldPosition: Vec3) {
        if (this.bubble.active)
            return;
        this.m_immortal = true;
        this.rigidbody.gravityScale = 0;
        this.rigidbody.linearVelocity = v2();
        this.rigidbody.angularVelocity = 0;
        //
        tween(this.node).to(0.2, { worldPosition: worldPosition }).call(() => {
            this.m_bubbleColider.enabled = true;
            this.bubble.active = true;
            this.rigidbody.gravityScale = -0.8;
            this.rigidbody.fixedRotation = true;
            let veloc = this.rigidbody.linearVelocity.clone();
            veloc = veloc.multiplyScalar(0.2);
            this.rigidbody.linearVelocity = veloc;
        }).start();
        //
        this.scheduleOnce(() => {
            this.m_immortal = false;
        }, 1);
    }

    onPlayerJump() {
        if (!this.m_control)
            return;
        //
        if (!this.m_grounded || this.m_lockInput || this.m_lockJump)
            return;
        this.m_lockJump = true;
        this.jumpAudio.play();
        this.m_grounded = false;
        let veloc = this.rigidbody.linearVelocity;
        veloc.y = this.jumpForce;
        this.rigidbody.linearVelocity = veloc;
        //
        setTimeout(() => {
            this.m_lockJump = false;
        }, 0.2);
    }

    onHurt() {
        if (this.m_finish)
            return;
        this.m_finish = true;
        this.m_lockInput = true;
        //this.spine.setAnimation(0, '2_hurt', true);
        this.hurtAudio.play();
        this.rigidbody.linearVelocity = v2();
        this.rigidbody.sleep;
        setTimeout(() => {
            director.emit(GameEvent.GAME_FINISH, false);
        }, 500);
        // this.scheduleOnce(() => {
        //     this.m_lockInput = false;
        //     this.spine.setAnimation(0, '1_idle_ingame', true);
        // }, 0.5);
    }

    onPlayerMoveLeft() {
        if (!this.m_control) {
            this.m_moveDirection = 0;
            return;
        }
        //
        if (this.m_finish)
            return;
        this.m_moveDirection = -1;
    }

    onPlayerMoveRight() {
        if (!this.m_control) {
            this.m_moveDirection = 0;
            return;
        }
        //
        if (this.m_finish)
            return;
        this.m_moveDirection = 1;
    }

    onPlayerMoveStop() {
        this.m_moveDirection = 0;
    }

    onPlayerStop(position: Vec3) {
        if (this.m_finish)
            return;
        this.spine.SetAnim('3_laugh', true);
        this.finishAudio.play();
        this.rigidbody.sleep;
        this.m_lockInput = true;
        this.m_finish = true;
        this.rigidbody.sleep();
        //tween
        let quat: Quat = new Quat();
        Quat.fromEuler(quat, 0, 0, 0);
        let move = tween(this.node).to(0.5, { worldPosition: v3(position.x, position.y, 0), rotation: quat })
        let scale = tween(this.spine.node).to(0.25, { scale: v3() });
        tween(this.node).sequence(move, scale).call(() => {
            director.emit(GameEvent.GAME_FINISH, true);
        }).start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.m_finish)
            return;
        switch (selfCollider.tag) {
            case -1://ground
                if (this.m_immortal)
                    return;
            case 50://monster
            case 60://flax
                setTimeout(() => {
                    this.m_bubbleColider.enabled = false;
                    this.bubble.active = false;
                    this.rigidbody.gravityScale = 10;
                    this.rigidbody.fixedRotation = false;
                    director.emit(GameEvent.PLAYER_NORMAL);
                }, 1);
                break;
            case 100:
                if (otherCollider.tag == 501)//trigger-run
                {
                    setTimeout(() => {
                        director.emit(GameEvent.GAME_TRIGGER_MOVE_RIGHT);
                        this.onPlayerMoveStop();
                        this.rigidbody.sleep();
                    }, 150);
                    setTimeout(() => {
                        otherCollider.node.destroy();
                    }, 1);
                }
                break;
        }
    }

    update(dt: number) {
        if (this.m_finish)
            return;
        //check ground
        let p1 = this.node.worldPosition;
        let p2 = p1.clone().subtract(v3(0, this.m_baseRadius * this.m_ratioSize + 10, 0));
        const results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.Any);
        if (results.length < 1)
            this.m_grounded = false;
        else {
            for (let i = 0; i < results.length; i++) {
                if (results[i].collider.tag == -1)//ground
                {
                    this.m_grounded = true;
                    director.emit(GameEvent.PLAYER_GROUND, p1.y, this.node);
                    break;
                } else
                    this.m_grounded = false;
            }
        }

        if (this.m_lockInput)
            return;
        let veloc = this.rigidbody.linearVelocity.clone();
        let current = veloc.clone();
        if (this.m_grounded) {
            this.rigidbody.applyTorque(-this.m_moveDirection * this.groundSpeedX * (this.rigidbody.getMass() / this.m_baseMass) * this.m_ratioSize, true);
            veloc = this.rigidbody.linearVelocity.clone();
        }
        else if (this.m_moveDirection != 0)
            veloc.x += this.m_moveDirection * this.airSpeedX;
        if (veloc.x > this.maxSpeedX)
            veloc.x = this.maxSpeedX;
        else if (veloc.x < -this.maxSpeedX)
            veloc.x = -this.maxSpeedX;
        this.rigidbody.linearVelocity = current.lerp(veloc, this.xDamping * dt);
    }
}