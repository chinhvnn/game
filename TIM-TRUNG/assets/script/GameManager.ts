
import { _decorator, Component, Node, Prefab, instantiate, Label, Gradient, Graphics, Color, Sprite, Vec3, TERRAIN_HEIGHT_BASE, random } from 'cc';
import { PlayerCtrl } from './PlayerCtrl';
import { Egg, KEY_CONNECTED, KEY_INGAME, KEY_SEARCH, PlayerData } from './GameDefine';
import { USE_WEBSOCKET_SERVER } from 'cc/userland/macro';
import { AICtrl } from './AICtrl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Wed Feb 16 2022 22:24:03 GMT+0700 (Indochina Time)
 * Author = chinhvnn
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/script/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
enum GameState {
    GS_SERVER,
    GS_INIT,
    GS_PLAYING,
    GS_END,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Prefab })
    public eggPrfb: Prefab | null = null;

    @property({ type: Prefab })
    public prefab_Player: Prefab | null = null;

    @property({ type: PlayerCtrl })
    public PlayerCtrl: PlayerCtrl | null = null;

    @property({ type: Label })
    public ScoreLabel: Label | null = null;
    @property({ type: Label })
    public TimeLabel: Label | null = null;
    @property({ type: Label })
    public EndLabel: Label | null = null;
    @property({ type: Label })
    public OppNumLabel: Label | null = null;

    @property({ type: Node })
    public StartMenu: Node | null = null;



    USE_WEBSOCKET_SERVER = true;
    websocket: WebSocket;
    AICtrl : AICtrl;
    public _score: number;
    public _time: number;
    public _oppPlayer: number;
    public isConnected: boolean = false;
    public playerDataMe: PlayerData = null;
    public playerDataAI: PlayerData = null;
    public egg: PlayerData = null;
    //public egg: Node;
    public clients = {};
    public OppAI = {};
    public id_client: number;
    public id_OppAI: number;
    public startPos = new Vec3(0, 0, 0);
    public _endGame: boolean;
    public _EggXPos: number;
    public _EggYPos: number;

    start() {
        this.curState = GameState.GS_INIT;
    }
    set curState(value: GameState) {
        switch (value) {
            case GameState.GS_SERVER:
                this.server();
                break;
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                this._score = 0;
                this._time = 500;
                this.ScoreLabel.string = "Score: " + this._score;
                this.curState = GameState.GS_SERVER;
                this._endGame = false;
                this.EndLabel.node.active = false;
                this.StartMenu.active = false;
                this.PlayerCtrl.node.active = true;
                this.ScoreLabel.node.active = true;
                this.TimeLabel.node.active = true;

                //this.createEgg();
                this.PlayerCtrl._Searching = true;
                break;
            case GameState.GS_END:
                this.websocket.close();
                this.node.removeAllChildren();
                this.EndLabel.node.active = true;
                this.EndLabel.string = "Your Score: " + this._score;
                this.init();
                break;
            default:
                break;
        }
    }
    // INIT VAR
    init() {
        this._endGame = true;
        this.StartMenu.active = true;
        this.PlayerCtrl.node.active = false;
        this.ScoreLabel.node.active = false;
        this.TimeLabel.node.active = false;

        this._oppPlayer = 1; //parseInt(this.OppNumLabel.string);
    }
    //LAM VIEC VOI SEVER
    server() {
        //TAO KET NOI DEN SERVER
        this.websocket = new
            // WebSocket("ws://192.168.1.64:8080");
            WebSocket("ws://localhost:8080");

        var self = this;
        this.websocket.onopen = function (evt) {
            self.isConnected = true;
        };

        this.websocket.onmessage = function (evt) {
            console.log('data: ' + evt.data);
            let playerdata = JSON.parse(evt.data);
            //  DIEU KHIEN NHAN VAT
            if (playerdata.key != undefined && playerdata.key == KEY_CONNECTED) {
                if (playerdata.type == 'ME') {
                    self.playerDataMe = playerdata;
                    console.log("connect succes to server");
                }
                // if (playerdata.type == "OTHER") {
                //     self.id_client = playerdata.id;
                //     self.clients[self.id_client] = playerdata;
                //     self.clients[self.id_client].node = instantiate(self.prefab_Player);
                //     self.node.addChild(self.clients[self.id_client].node);
                // }
                if (playerdata.type == "OPP-AI") {
                    self.id_OppAI = playerdata.id;
                    self.OppAI[self.id_OppAI] = playerdata;
                    self.OppAI[self.id_OppAI].node = instantiate(self.prefab_Player);
                    self.node.addChild(self.OppAI[self.id_OppAI].node);
                }
                if (playerdata.type == "EGG") {
                    if (playerdata.search == 'OK') {
                        self.egg = playerdata;
                        self.egg.node = instantiate(self.eggPrfb);
                        let colorArr = [Color.GREEN, Color.RED, Color.YELLOW, Color.BLUE, Color.MAGENTA];
                        let color = self.egg.node.getComponent(Sprite);
                        color.color = colorArr[(Math.floor(Math.random() * colorArr.length))];
                        self.node.addChild(self.egg.node);
                        self._EggXPos = playerdata.x;
                        self._EggYPos = playerdata.y;
                        self.egg.node.setPosition(self._EggXPos, self._EggYPos );
                    }
                }
            }
            //DI CHUYỂN PLAYER KHÁC KẾT NỐI REALTIME
            // for (let id in self.clients) {
            //     for (let i = 0; i <= playerdata.length; i++) {
            //         if (self.clients[id].id == playerdata[i].id)
            //             self.clients[id].node.setPosition(playerdata[i].x, playerdata[i].y, 0);
            //     }
            // }
            //DI CHUYỂN PLAYER AI
            for (let id in self.OppAI) {
                for (let key in playerdata) {
                    if (self.OppAI[id].id == playerdata.id)
                        self.OppAI[id].node.setPosition(playerdata.x, playerdata.y, 0);
                }
            }
        };

        this.websocket.onclose = function (event) {
            console.log("Closed ");
            self.isConnected = false;
        };
    }

    onStartButtonClick() {
        this.curState = GameState.GS_PLAYING;
    }

    update(deltaTime: number) {
        // TIMER
        this._time -= 1;
        this.TimeLabel.string = "Time: " + this._time;

        // TIM BONG
        if (this._endGame == false && this._time >= 0) {
            if (this.PlayerCtrl._Searching == false) {
                this._score = this._score + 1;
                this.ScoreLabel.string = "Score: " + this._score;
                this.node.removeChild(this.egg.node);
                this.Send(this.getInfo(KEY_INGAME, 'OK'));
                this.PlayerCtrl._Searching = true;
            }
            // GUI VI TRI CUA PLAYER LEN SERVER
            this.Send(this.getInfo(KEY_INGAME, ""));
            if (this.isConnected == false)
                return;
        } else {
            //this.node.removeChild(this.egg);
            this.curState = GameState.GS_END;
        }
    }

    getInfo(type: string, search: string) {
        this.playerDataMe.x = this.PlayerCtrl.node.getPosition().x;
        this.playerDataMe.y = this.PlayerCtrl.node.getPosition().y;
        this.playerDataMe.type = type;
        this.playerDataMe.search = search;
        return JSON.stringify(this.playerDataMe);
    }

    // createEgg() {
    //     this.egg = instantiate(this.eggPrfb);
    //     let colorArr = [Color.GREEN, Color.RED, Color.YELLOW, Color.BLUE, Color.MAGENTA];
    //     this.node.addChild(this.egg);
    //     let color = this.egg.getComponent(Sprite);
    //     color.color = colorArr[(Math.floor(Math.random() * colorArr.length))];
    //     this.egg.setPosition((Math.random() * 800)-400, (Math.random() * 400)-200, 0);
    // }

    public Send(data: string) {
        if (this.websocket != null && this.isConnected == true)
            this.websocket.send(data);
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
