/**
 * TODO:
 * - Add room feature
 * -
 */
const socket = io();
// DOM nodes
const textInput = document.querySelector('form');
const msgInput = document.querySelector('#msg-input');
const chatArea = document.querySelector('.chat-area');
const messages = document.querySelector('#messages');
const addRoom = document.querySelector('#add-room');

textInput.addEventListener('submit', e => {
	// console.log(msgInput.value);
	// Send msg to server
	socket.emit('chat message', msgInput.value);
	msgInput.value = '';
});

addRoom.addEventListener('click', async () => {
	const res = await fetch('http://localhost:3000/123');
	console.log(await res.json());
});

socket.on('connect', () => {
	console.log(socket.id);
	const myUsername = prompt('Please enter you username: ', 'Anonymous');
	socket.emit('username', { username: myUsername });

	// Listen for msg from server
	socket.on('chat message', data => {
		const { username, msg } = data;
		console.log(username, msg);
		messages.innerHTML +=
			username === myUsername
				? `
                    <li class="chat-msg self">
                        ${msg}
                    </li>
                `
				: `
                    <li class="chat-msg him">
                        ${msg}
                    </li>
                `;
	});
});
