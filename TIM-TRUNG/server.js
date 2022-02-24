const WebSocket = require('ws')
const uuidv1 = require('uuidv1');

//tạo constructor Playerdata ở phía server
class PlayerData {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.status = 0;
        this.key = '';
        this.search = '';
    }
}

const KEY_CONNECTED = 'connected';
const KEY_READY = 'ready';
const KEY_INGAME = 'ingame';
// https://www.jianshu.com/p/a391b8452b5a 

//khởi tạo server và list user
const wss = new WebSocket.Server({ port: 8080 })
let users = {};

wss.on('connection', function connection(ws) {
    //KHỞI TẠO PLAYER
    let player = new PlayerData(uuidv1(), 0, 0);
    player.ws = ws;
    player.key = KEY_CONNECTED;
    users[player.id] = player;
    //GỬI XUỐNG CLIENT DỮ LIỆU NGƯỜI CHƠI
    ws.send(JSON.stringify({
        'id': player.id,
        'x': player.x,
        'y': player.y,
        'key': player.key,
        'type': 'ME',
        'search': ''
    }));

    console.log('____________________');
    console.log('| client++: ' + player.id + ' connected');
    console.log('| size : ' + Object.keys(users).length);
    // console.log(Object.keys(wss).length);
    console.log('____________________');

    //LẶP VÀ GỬT XUỐNG DỮ LIỆU CỦA NGƯỜI CHƠI KHÁC
    // for (const user_id in users) {
    //     let user = users[user_id];
    //     if (Object.hasOwnProperty.call(users, user_id)) {
    //         if (users[user_id] != player)  //users.ws !=ws
    //         {
    //             //GỬI XUỐNG DỮ LIỆU MỚI CHO KẾT NỐI CŨ
    //             user.ws.send(JSON.stringify({
    //                 'id': player.id,
    //                 'x': player.x,
    //                 'y': player.y,
    //                 'key': player.key,
    //                 'type': 'OTHER',
    //             }));
    //             //GỬI XUỐNG DỮ LIỆU CŨ CHO KẾT NỐI MỚI
    //             ws.send(JSON.stringify({
    //                 'id': user.id,
    //                 'x': user.x,
    //                 'y': user.y,
    //                 'key': user.key,
    //                 'type': 'OTHER',
    //             }));
    //         }
    //     }
    // }

    //GỬT XUỐNG DỮ LIỆU CỦA NGƯỜI CHƠI AI
    let OppAI = new PlayerData(uuidv1(), 0, 0);
    OppAI.ws = ws;
    let xPosAI = (Math.random() * 700) - 350;
    let yPosAI = (Math.random() * 300) - 150;
    ws.send(JSON.stringify({
        'id': OppAI.id,
        'x': xPosAI,
        'y': yPosAI,
        'key': KEY_CONNECTED,
        'type': 'OPP-AI'
    }));

    //KHỞI TẠO BALL
    let egg = new PlayerData(uuidv1(), 0, 0);
    egg.ws = ws;
    let xPosEgg = (Math.random() * 700) - 350;
    let yPosEgg = (Math.random() * 300) - 150;
    ws.send(JSON.stringify({
        'id': egg.id,
        'x': xPosEgg,
        'y': yPosEgg,
        'key': KEY_CONNECTED,
        'type': 'EGG',
        'search': 'OK'
    }
    ));
    ////////////////////////////////////////////////////
    ws.on('message', data => {
        let playerdata = JSON.parse(data);

        //NEU TIM THAY BONG THI RESET
        if (playerdata.search == "OK") {
            xPosEgg = (Math.random() * 700) - 350;
            yPosEgg = (Math.random() * 300) - 150;
            ws.send(JSON.stringify({
                'id': egg.id,
                'x': xPosEgg,
                'y': yPosEgg,
                'key': KEY_CONNECTED,
                'type': 'EGG',
                'search': 'OK'
            }
            ));
            playerdata.search == "";
        }
        //SEND AI DATA
        let Xkc = xPosEgg - xPosAI;
        let Ykc = yPosEgg - yPosAI;
        ws.send(JSON.stringify({
            'id': OppAI.id,
            'x': xPosAI += Xkc * 0.01,
            'y': yPosAI += Ykc * 0.01,
            'key': KEY_INGAME,
            'type': 'OPP-AI'
        }));
        //QUAN LY NHAN VAT
        // let pack = new Array();
        // if (playerdata.type == KEY_INGAME) {
        //     /// LAP MANG CAC PLAYER
        //     for (let id in users) {
        //         let user = users[id];
        //         user.type = KEY_INGAME;
        //         pack.push(playerdata);
        //     }
        //     /// GUI LAI CLIENT
        //     for (let id in users) {
        //         users[id].ws.send(JSON.stringify(pack));
        //     }

        // }
    });
    ////////////////////////////////////////////////////
    ws.on('close', message => {
        console.log('close .. ');
        console.log(message);
        console.log(wss.clients.length);

        for (let obj in users) {
            console.log(obj);
            if (users[obj].ws == ws) {
                console.log("remove client --");
                delete users[obj];
                break;
            }
        }
        console.log('clients size : ' + Object.keys(users).length);
    });
    ////////////////////////////////////////////////////
    ws.on('error', function (code, reason) {
        console.log(code);
    });
});

