import { _decorator, Component, Node, input, Input, KeyCode, director, CCBoolean, Button, Vec3 } from 'cc';
import GameEvent from '../GameEvent';
import Loader from '../Loader';
const { ccclass, property } = _decorator;

@ccclass('PlayerInput')
export class PlayerInput extends Component {

    @property(CCBoolean)
    loop = false;

    @property(CCBoolean)
    directStore = false;

    @property(Node)
    buttonLeft: Node = null;

    @property(Node)
    buttonRight: Node = null;

    @property(Node)
    buttonJump: Node = null;

    @property(Node)
    buttonSwitch: Node = null;

    m_keyLeftActive: boolean = false;
    m_keyRightActive: boolean = false;
    m_jumpActive: boolean = false;
    m_switchIndex: number = 0;

    onLoad() {
        if (this.directStore)
            return;
        if (this.loop) {
            this.buttonRight.getChildByName('hand').active = Loader.finish;
            this.buttonSwitch.getChildByName('hand').active = Loader.finish;
            if (Loader.finish)
                return;
        }

        input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
        input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);
        //
        this.buttonJump.on(Input.EventType.TOUCH_START, this.onJumpStart, this);
        this.buttonJump.on(Input.EventType.TOUCH_END, this.onJumpEnd, this);
        this.buttonJump.on(Input.EventType.TOUCH_CANCEL, this.onJumpEnd, this);

        this.buttonLeft.on(Input.EventType.TOUCH_START, this.onLeftStart, this);
        this.buttonLeft.on(Input.EventType.TOUCH_END, this.onLeftEnd, this);
        this.buttonLeft.on(Input.EventType.TOUCH_CANCEL, this.onLeftEnd, this);

        this.buttonRight.on(Input.EventType.TOUCH_START, this.onRightStart, this);
        this.buttonRight.on(Input.EventType.TOUCH_END, this.onRightEnd, this);
        this.buttonRight.on(Input.EventType.TOUCH_CANCEL, this.onRightEnd, this);

        director.on(GameEvent.PLAYER_STOP, this.onHideControl, this);
        director.on(GameEvent.GAME_FINISH, this.onHideControl, this);
        director.on(GameEvent.GAME_LOSE, this.onHideControl, this);
        director.on(GameEvent.GAME_STORE_BUTTON, this.onHideControl, this);
    }

    onJumpStart() {
        this.m_jumpActive = true;
    }

    onJumpEnd() {
        this.m_jumpActive = false;
    }

    onLeftStart() {
        this.m_keyLeftActive = true;
    }

    onLeftEnd() {
        this.m_keyLeftActive = false;
        if (!this.m_keyRightActive)
            director.emit(GameEvent.PLAYER_MOVE_STOP);
    }

    onRightStart() {
        this.m_keyRightActive = true;
    }

    onRightEnd() {
        this.m_keyRightActive = false;
        if (!this.m_keyLeftActive)
            director.emit(GameEvent.PLAYER_MOVE_STOP);
    }

    onKeyPressed(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case KeyCode.ARROW_LEFT:
                this.m_keyLeftActive = true;
                break;
            case KeyCode.ARROW_RIGHT:
                this.m_keyRightActive = true;
                this.moveOnclick();
                break;
            case KeyCode.SPACE:
            case KeyCode.ARROW_UP:
                this.m_jumpActive = true;
                break;
            case KeyCode.TAB:
                this.m_switchIndex = this.m_switchIndex == 0 ? 1 : 0;
                director.emit(GameEvent.PLAYER_SWITCH, this.m_switchIndex);
                break;
        }
    }

    onKeyReleased(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case KeyCode.ARROW_LEFT:
                this.m_keyLeftActive = false;
                if (!this.m_keyRightActive)
                    director.emit(GameEvent.PLAYER_MOVE_STOP);
                break;
            case KeyCode.ARROW_RIGHT:
                this.m_keyRightActive = false;
                if (!this.m_keyLeftActive)
                    director.emit(GameEvent.PLAYER_MOVE_STOP);
                break;
            case KeyCode.SPACE:
            case KeyCode.ARROW_UP:
                this.m_jumpActive = false;
                break;
        }
    }

    update(dt: number) {
        if (this.m_keyLeftActive)
            director.emit(GameEvent.PLAYER_MOVE_LEFT);
        else if (this.m_keyRightActive)
            director.emit(GameEvent.PLAYER_MOVE_RIGHT);

        if (this.m_jumpActive)
            director.emit(GameEvent.PLAYER_JUMP);
    }

    moveOnclick() {
        if (this.directStore || Loader.finish) {
            this.buttonRight.getComponent(Button).interactable = false;
            return;
        }
        director.emit(GameEvent.PLAYER_MOVE_RIGHT, false);
    }

    switchOnClick() {
        if (this.directStore || Loader.finish) {
            this.buttonSwitch.getComponent(Button).interactable = false;
            return;
        }
        this.m_switchIndex = this.m_switchIndex == 0 ? 1 : 0;
        director.emit(GameEvent.PLAYER_SWITCH, this.m_switchIndex);
    }

    onHideControl(position: Vec3) {
        this.node.active = false;
    }
}