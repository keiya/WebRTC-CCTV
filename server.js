var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});
var slot = [];
var maxid = 0;
wss.on('connection', function(ws) {
	var id = maxid;
	console.log('connection open #%d',id);
    ws.on('message', function(data) {
		broadcast('DAT',id,data);
    });
    ws.on('close', function() {
		console.log('connection closed #%d',id);
        // 接続切れのソケットを配列から除外
        slot = slot.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
        broadcast('CTL','close',id);
    });
	slot[id] = ws;
	++maxid;
});

function broadcast(type,id,data) {
	var buf = '';
	slot.forEach(function(socket,i){
		buf = type + ' ' + id + ' ';
		buf += data;
		try {
			socket.send(buf);
		}
		catch (e) {};
	});
}
