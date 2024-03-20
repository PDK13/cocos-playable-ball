import { _decorator } from 'cc';

export default class GameEvent  {
    static PLAYER_JUMP: string = 'EVENT_PLAYER_JUMP';
    static PLAYER_MOVE_LEFT: string = 'EVENT_PLAYER_MOVE_LEFT';
    static PLAYER_MOVE_RIGHT: string = 'EVENT_PLAYER_MOVE_RIGHT';
    static PLAYER_SWITCH: string = 'EVENT_PLAYER_SWITCH';
    static PLAYER_MOVE_STOP: string = 'EVENT_PLAYER_MOVE_STOP';
    static PLAYER_STOP: string = 'EVENT_PLAYER_STOP';
    static GAME_FINISH: string = 'GAME_FINISH';
    static GAME_LOSE: string = 'GAME_LOSE';
    static GAME_STORE: string = 'GAME_STORE';
    static TRIGGER_KEY: string = 'TRIGGER_KEY';
    static PLAYER_HURT = 'PLAYER_HURT';
    static PLAYER_X4 = 'PLAYER_X4';
    static PLAYER_BUBBLE = 'PLAYER_BUBBLE';
    static PLAYER_NORMAL = 'PLAYER_NORMAL';
    static PLAYER_GROUND = 'PLAYER_GROUND';
    static GAME_TRIGGER_MOVE_RIGHT: string = 'TRIGGER_MOVE_RIGHT';
    static GAME_TRIGGER_SWITCH: string = 'TRIGGER_SWITCH';
    static GAME_STORE_BUTTON: string = 'GAME_STORE_BUTTON';
}