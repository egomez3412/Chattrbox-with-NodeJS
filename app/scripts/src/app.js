import socket from './ws-client';
import {UserStore} from './storage';
import {ChatForm, ChatList, promptForUsername} from './dom';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input]';
const LIST_SELECTOR =  '[data-chat="message-list"]';

// let username = '';
// username = promptForUsername();
let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if(!username) {
  username = promptForUsername();
  userStore.set(username);
}

class ChatApp {
    constructor() {
        this.ChatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
        this.ChatList = new ChatList(LIST_SELECTOR, username);

        socket.init('ws://localhost:3001');
        socket.registerOpenHandler(() => {
            this.ChatForm.init((data) => {
              let message = new ChatMessage({message: data});
              socket.sendMessage(message.serialize());
            });
        });
            socket.registerMessageHandler((data) => {
            console.log(data);
            let message = new ChatMessage(data);
            this.ChatList.drawMessage(message.serialize());
        });
        this.ChatList.init();
    }
}

class ChatMessage {
    constructor({
      message: m, user: u=username, timestamp: t=(new Date()).getTime() }) {
        this.message = m;
        this.user = u;
        this.timestamp = t;
      }
      serialize() {
        return {
          user: this.user, message: this.message, timestamp: this.timestamp
        };
      }
    }
// new ChatApp();
export default ChatApp;