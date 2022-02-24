import { Node } from "cc";

export class PlayerData implements DataSocket{ 
    id : string;
    x : number;
    y : number;
    key : string;
    type : string;
    search : string;
    node : Node;
}

export class Egg implements DataSocket{ 
    id : string;
    x : number;
    y : number;
    key : string;
    type : string;
    node : Node;
}

export interface DataSocket {
    id : string;
    x : number;
    y : number;
    key : string;
    type : string;
}

export const KEY_CONNECTED = 'connected';
export const KEY_READY = 'ready';
export const KEY_INGAME = 'ingame';
export const KEY_SEARCH = 'searchball';