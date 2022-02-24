
import { _decorator, Component, Animation, input, EventKeyboard, Input, __private, KeyCode, Collider2D, IPhysics2DContact, Contact2DType, Node } from 'cc';
import { KEY_INGAME, PlayerData } from './GameDefine';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerCtrl
 * DateTime = Wed Feb 16 2022 17:51:51 GMT+0700 (Indochina Time)
 * Author = chinhvnn
 * FileBasename = PlayerCtrl.ts
 * FileBasenameNoExtension = PlayerCtrl
 * URL = db://assets/script/PlayerCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    @property({type: Animation})
    public BodyAnim: Animation|null = null;

    public _Searching : boolean;
    public dirX : number = 0;
    public dirY : number = 0;
    public speed : number = 100;
    public xMove : number;
    public yMove : number;
    public playerPosString: string;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onkeydown, this);
        input.on(Input.EventType.KEY_UP, this.onkeyup, this);
        input.on(Input.EventType.KEY_PRESSING, this.onkeydown, this);

        let collider = this.getComponent(Collider2D);
        if (collider) {
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
      }
    onkeydown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.BodyAnim.play('moveLeft');
                this.dirX = (-1);
                break;
                case KeyCode.ARROW_RIGHT:
                this.BodyAnim.play('moveRight');
                this.dirX = 1;
                break;
                case KeyCode.ARROW_UP:
                this.BodyAnim.play('moveUp');
                this.dirY = 1;
                break;
            case KeyCode.ARROW_DOWN:
                this.BodyAnim.play('moveDown');
                this.dirY = (-1);
                break;
            }
    }
    onkeyup(event: EventKeyboard) {
        this.dirX = 0;
        this.dirY = 0;
    }
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        this._Searching = false;
        console.log("cham nhau roi ne");
    }
     update (deltaTime: number) {
        if(this.dirX==0 && this.dirY == 0)
             return;
             this.xMove = this.node.position.x;
             this.yMove = this.node.position.y;
             this.xMove = this.xMove + this.dirX*this.speed*deltaTime;
             this.yMove = this.yMove + this.dirY*this.speed*deltaTime;
             this.node.setPosition(this.xMove, this.yMove, 0);
        }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
