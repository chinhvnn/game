
import { _decorator, Component, Node, input, EventKeyboard, Input, __private, KeyCode, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AICtrl')
export class AICtrl extends Component {
    public _Searching2 : boolean;
    start() {
        //CONTACT
        let collider = this.getComponent(Collider2D);
        if (collider) {
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
      }
   
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        this._Searching2 = false;
        console.log("cham nhau roi ne");
    }
    //  update (deltaTime: number) {

    //  }
        
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
