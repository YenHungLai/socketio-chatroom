const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/:roomId', (req, res) => {
	console.log(req.params);
	res.json({ msg: 'You just joined room!' });
});

const users = [];

io.on('connection', socket => {
	// console.log(socket.id)
	socket.on('username', data => {
		const { username } = data;
		console.log(username);

		// Something like this for rooms???
		// if (username === 'Jacob') {
		// 	socket.join('room1');
		// } else socket.join('room2');
		// io.to('room1').emit('chat message', { msg: 'You r in room1' });
		// io.to('room2').emit('chat message', { msg: 'You r in room2' });

		socket.on('chat message', msg => {
			console.log(msg);
			io.emit('chat message', { username, msg });
		});
	});
});
