import Chat from './Chat';
import { validNick } from '../../shared/util'

class Client {
    constructor () {
        this.startButton = document.getElementById('startButton');
        this.userName = document.getElementById('userNameInput');

	    this.setupEvents();
    }

	setupEvents() {
		this.startButton.onclick = () => {
			this.startChat(this.userName.value);
		};

		this.userName.addEventListener('keypress', (e) => {
			let key = e.which || e.keyCode;

			if (key === 13) {
				this.startChat(this.userName.value);
			}
		});
    }

    startChat(nick) {
        this.validateNick(nick);
        this.displayChatBox()
    }

	validateNick(nick) {
		let nickErrorText = document.querySelector('#startMenu .input-error');

		if (validNick(nick)) {
			nickErrorText.style.opacity = 0;
			this.nick = nick;
		} else {
			nickErrorText.style.opacity = 1;
			return false;
		}
	}

    displayChatBox() {
	    this.chat = new Chat(this.nick);

	    document.getElementById('startMenu').style.display = 'none';
	    document.getElementById('chatbox').style.display = 'block';
    }
}

window.onload = () => {
    new Client();
};