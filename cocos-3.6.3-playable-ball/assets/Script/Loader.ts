import { _decorator, Component, PhysicsSystem2D, v2, Node, game, director, tween, v3, CCString, sys, Enum, Input, CCBoolean, Button } from 'cc';
import GameEvent from './GameEvent';
import { CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Loader')
export default class Loader extends Component {

    @property(CCBoolean)
    loop = false;

    @property(CCBoolean)
    auto = false;

    @property(CCBoolean)
    showRight = false;

    @property(CCBoolean)
    showSwitch = false;

    @property(CCBoolean)
    directStore = false;

    @property(CCString)
    androidLink = "";

    @property(CCString)
    iosLink = "";

    @property(Node)
    panelComplete: Node = null;

    @property(Node)
    panelLose: Node = null;

    @property(Node)
    buttonMoveRight: Node = null;

    @property(Node)
    buttonSwitch: Node = null;

    @property(Node)
    buttonStore: Node = null;

    @property([Node])
    otherInput: Node[] = [];

    static finish: boolean = false;
    movedRightShow: boolean = false;
    switchShow: boolean = false;

    onLoad() {
        game.frameRate = 59;
        director.on(GameEvent.GAME_FINISH, this.onFinish, this);
        director.on(GameEvent.GAME_LOSE, this.onLose, this);
        director.on(GameEvent.GAME_STORE, this.retryOnclick, this);
        director.on(GameEvent.PLAYER_MOVE_RIGHT, this.moveRightOnclick, this);
        director.on(GameEvent.PLAYER_SWITCH, this.switchOnclick, this);
        director.on(GameEvent.GAME_STORE_BUTTON, this.onStoreButton, this);
        if (this.directStore || Loader.finish) {
            this.node.on(Input.EventType.TOUCH_START, this.retryOnclick, this);
        }
        //
        PhysicsSystem2D.instance.enable = true;
        //PhysicsSystem2D.instance.gravity = v2(0, -4000);
        //
        this.otherInput.forEach(e => {
            e.active = Loader.finish || !this.auto;
        });
        if (Loader.finish || !this.auto) {
            if (this.buttonMoveRight != null)
                this.buttonMoveRight.active = this.showRight;
            if (this.buttonSwitch != null)
                this.buttonSwitch.active = this.showSwitch;
        }
    }

    onFinish(win: boolean) {
        if (this.loop) {
            Loader.finish = true;
            director.loadScene(director.getScene().name);
            return;
        }

        if (win) {
            this.panelComplete.active = true;
            let panel = this.panelComplete.getChildByName("panel");
            tween(panel).to(0.1, { scale: v3(1, 1, 1) }).start();
        } else {
            this.panelLose.active = true;
            let panel = this.panelLose.getChildByName("panel");
            tween(panel).to(0.1, { scale: v3(1, 1, 1) }).start();
        }
    }

    onMoveRight() {
        if (Loader.finish)
            return;
        if (this.buttonMoveRight != null) {
            this.buttonMoveRight.active = true;
            this.buttonMoveRight.getChildByPath('hand').active = true;
        }
    }

    onSwitch() {
        if (Loader.finish)
            return;
        if (this.buttonSwitch != null) {
            this.buttonSwitch.active = true;
            this.buttonSwitch.getChildByPath('hand').active = true;
        }
    }

    retryOnclick() {
        let link = '';
        switch (sys.os) {
            case sys.OS.ANDROID:
                link = this.androidLink;
                break;
            case sys.OS.IOS:
                link = this.iosLink;
                break;
            default:
                link = this.androidLink;
                break;
        }
        openGameStoreUrl(link);
    }

    moveRightOnclick() {
        if (this.movedRightShow || !this.auto || Loader.finish || this.directStore)
            return;
        this.movedRightShow = true;
        this.otherInput.forEach(e => {
            e.active = true;
        });
        if (this.buttonMoveRight != null) {
            this.buttonMoveRight.active = true;
            this.buttonMoveRight.getChildByPath('hand').active = false;
        }
        director.off(GameEvent.GAME_TRIGGER_MOVE_RIGHT, this.onMoveRight, this)
    }

    switchOnclick(SwitchIndex: number) {
        if (this.switchShow || !this.auto || Loader.finish || this.directStore)
            return;
        this.switchShow = true;
        this.otherInput.forEach(e => {
            e.active = true;
        });
        if (this.buttonSwitch != null) {
            this.buttonSwitch.active = true;
            this.buttonSwitch.getChildByPath('hand').active = false;
        }
        director.off(GameEvent.GAME_TRIGGER_SWITCH, this.onSwitch, this)
    }

    onStoreButton() {
        this.buttonStore.active = true;
    }

    onLose() {
        if (this.loop) {
            Loader.finish = true;
            director.loadScene(director.getScene().name);
            return;
        }
        this.panelLose.active = true;
        let panel = this.panelLose.getChildByName("panel");
        tween(panel).to(0.1, { scale: v3(1, 1, 1) }).start();
    }
}
