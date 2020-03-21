const WebSocket = require('ws');

let clients: any = [];
const port = Number(process.env.SERVICE_PORT) || 3069;

const webSocketServer = new WebSocket.Server({ port }, () => {
	console.log(`connection service listening on port ${port}`);
});

const handleMessage = (message: any) => {
	for (var i = 0; i < clients.length; i++) {
		const player = [];
		if (clients[i].readyState === 1) {
			if (message) {
				var obj = JSON.parse(message.toString());

				console.log(obj);

				player.push({ playerId: obj.playerId });
			}

			clients[i].send(JSON.stringify({ success: true, player, ping: true }));
		}
	}
};

const baseConnection = (ws: any) => {
	console.log(`Creating connection...`);

	clients.push(ws);

	ws.on('message', (message: any) => handleMessage(message));
};

webSocketServer.on('connection', (ws: any) => baseConnection(ws));

export class Connection {
	constructor() {}
}

const connection = new Connection();
