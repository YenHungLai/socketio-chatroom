/**
 * TODO:
 * - Note: when you refresh, you become a different socket
 * - Message timestamp
 * - Modal for prompts
 * - Responsiveness
 */
const socket = io();
// DOM nodes
const charAreaContainer = document.querySelector('.chat-area-container');
const textInput = document.querySelector('form');
const msgInput = document.querySelector('#msg-input');
const chatArea = document.querySelector('.chat-area');
const messages = document.querySelector('#messages');
const addRoom = document.querySelector('#add-room');
const roomsList = document.querySelector('.rooms-list');
const username = document.querySelector('.username');
const sectionBtns = document.querySelector('.section-btns');

let selectedRoomId;

textInput.addEventListener('submit', e => {
	// console.log(msgInput.value);
	socket.emit('chat message', {
		roomId: selectedRoomId,
		msg: msgInput.value,
		timestamp: new Date().toLocaleTimeString()
	});
	msgInput.value = '';
});

addRoom.addEventListener('click', () => {
	const roomId = prompt('Please enter a room name: ', 'Anonymous');
	const friendName = prompt('Please enter a friend name: ', 'Anonymous');
	socket.emit('create room', { roomId, friendName });
});

socket.on('connect', () => {
	console.log(socket.id);
	const myUsername = prompt('Please enter your username: ', 'Anonymous');
	username.innerText = myUsername;
	socket.emit('username', { username: myUsername });

	// Get all rooms this user is in
	socket.on('rooms', data => {
		const { rooms } = data;
		console.log(rooms);
		roomsList.innerHTML = '';
		rooms.forEach(room => {
			roomsList.innerHTML += `
                <div class='room'>
                    <i class="fas fa-user-circle fa-3x"></i>
                    <p>${room.roomId}</p>
                </div>
            `;
		});
		roomsList.childNodes.forEach(child => {
			child.addEventListener('click', e => {
				console.log(e.target.querySelector('p').innerText);
				selectedRoomId = e.target.querySelector('p').innerText;
				socket.emit('join room', { roomId: selectedRoomId });
				charAreaContainer.style.visibility = 'visible';
				messages.innerHTML = '';
			});
		});
	});

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

// DOM manipulation
sectionBtns.childNodes.forEach(child => {
	child.addEventListener('click', () => {
		child.style.color = 'blue';
		getSiblings(child).forEach(sibling => {
			sibling.style.color = '#7e7a7a';
		});
	});
});

const getSiblings = elem => {
	const siblings = [];
	let sibling = elem.parentNode.firstChild;
	for (; sibling; sibling = sibling.nextSibling)
		if (sibling.nodeType == 1 && sibling != elem) siblings.push(sibling);
	return siblings;
};
