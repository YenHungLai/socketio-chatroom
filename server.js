/**
 * TODO:
 * - How to host an express static web app, not API
 */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const serverless = require('serverless-http');

app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/:roomId', (req, res) => {
	console.log(req.params);
	const { roomId } = req.params;
	res.json({ msg: 'You just joined a room!' });
});

const rooms = [];

io.on('connection', socket => {
	// console.log(socket.id)
	socket.on('username', data => {
		const { username } = data;
		console.log(username);

		socket.emit('rooms', { rooms });

		socket.on('chat message', data => {
			console.log(data);
			const { msg, roomId } = data;
			io.to(roomId).emit('chat message', { username, msg });
		});

		socket.on('create room', data => {
			const { roomId, friendName } = data;
			console.log(friendName);
			rooms.push({
				roomId,
				users: [{ username }, { username: friendName }]
			});
			console.log(rooms);
			socket.emit('rooms', { rooms });
		});

		socket.on('join room', data => {
			const { roomId } = data;
			console.log(roomId);
			socket.leaveAll();
			socket.join(roomId);
		});
	});
});

server.listen(3000, () => console.log(`Server running on port 3000`));

module.exports.handler = serverless(app);
