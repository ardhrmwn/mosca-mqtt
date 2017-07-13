var mosca = require('mosca');
var http = require('http');

var moscaSetting = {
	interfaces: [
		{ type: "mqtt", port: 1883 },
    ],
    id: "mqtt-mosca",
    stats: false,
	publishNewClient: false,
	publishClientDisconnect: false,
	publishSubscriptions: false,
	// logger: { name: 'MQTTServer', level: 'debug' },
	persistence: { factory: mosca.persistence.LevelUp, path: "app/db" },
};

var server = new mosca.Server(moscaSetting);

var httpServ = http.createServer();
server.attachHttpServer(httpServ);
var webSocketPort = parseInt(process.env.WEBSOCKET_PORT) || 3000
httpServ.listen(webSocketPort);

function setup() {
	console.log('MQTT Server is up and running.');
}

server.on('ready', setup);

server.on("error", function (err) {
	console.log(err);
});

server.on('clientConnected', function (client) {
	console.log('Client Connected \t:= ', client.id);
});

server.on('published', function (packet, client) {
	console.log(packet.payload.toString());
});

server.on('subscribed', function (topic, client) {
	console.log("Subscribed :=", topic);
});

server.on('unsubscribed', function (topic, client) {
	console.log('unsubscribed := ', topic);
});

server.on('clientDisconnecting', function (client) {
	console.log('clientDisconnecting := ', client.id);
});

server.on('clientDisconnected', function (client) {
	console.log('Client Disconnected     := ', client.id);
});
