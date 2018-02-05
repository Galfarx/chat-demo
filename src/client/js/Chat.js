import io from 'socket.io-client';
import { sanitizeString } from '../../shared/util';

export default class Chat {
    constructor(nick) {
        this.chatInput = document.getElementById('chatInput');
        this.chatList = document.getElementById('chatList');
        this.nick = nick;
        this.socket = io({query: `nick=${nick}`});

        this.setupSocket();
        this.setupChat();
        this.setupEvents();
    }

    setupSocket() {
        this.socket.on('connect_failed', () => {
            this.socket.close();
        });

        this.socket.on('disconnect', () => {
            this.socket.close();
        });

        this.socket.on('userDisconnect', (data) => {
	        this.addSystemLine(`<b> ${data.nick.length < 1 ? 'Anon' : data.nick} </b> disconnected.`);
        });

        this.socket.on('userJoin', (data) => {
            this.addSystemLine(`<b> ${data.nick.length < 1 ? 'Anon' : data.nick} </b> joined.`);
        });

        this.socket.on('serverSendUserChat', (data) => {
            this.addChatLine(data.nick, data.message, false);
        });
    }

    setupChat() {
        this.addSystemLine('Connected to the chat!');
    }

    setupEvents() {
        this.chatInput.addEventListener('keypress', (key) => {
            key = key.which || key.keyCode;
            if (key === 13) {
                this.sendChat(sanitizeString(this.chatInput.value));
                this.chatInput.value = '';
            }
        });

        this.chatInput.addEventListener('keyup', (key) => {
            key = key.which || key.keyCode;
            if (key === 27) {
                this.chatInput.value = '';
            }
        });
    }

    sendChat(text) {
	    if (!text) return;

	    this.socket.emit('userChat', {nick: this.nick, message: text});
	    this.addChatLine(this.nick, text, true);
    }


    addChatLine(name, message, me) {
        let newline = document.createElement('li');

        newline.className = (me) ? 'me' : 'friend';
        newline.innerHTML = `<b>${name.length < 1 ? 'Anon' : name}:</b> ${message}`;

        this.appendMessage(newline);
    }

    addSystemLine(message) {
        let newline = document.createElement('li');

        newline.className = 'system';
        newline.innerHTML = message;

        this.appendMessage(newline);
    }

    appendMessage(node) {
        if (this.chatList.childNodes.length > 10) {
            this.chatList.removeChild(this.chatList.childNodes[0]);
        }
        this.chatList.appendChild(node);
    };
}
