import ChatAPI from './api/ChatAPI';
import Modal from './Modal';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI('https://ahj-homeworks-sse-ws-chat-backend-7gs4.onrender.com/');
    this.websocket = null;
    this.user = null;
    this.users = [];
  }

  init() {
    this.bindToDOM();
    Modal.init();
    this.registerEvents();
  }

  bindToDOM() {
    this.onSubmit = this.onSubmit.bind(this);
    this.onEnterChatHandler = this.onEnterChatHandler.bind(this);
  }

  registerEvents() {
    const form = document.querySelector('.modal__form');
    form.addEventListener('submit', this.onSubmit);
  }

  onSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const elName = form.name;
    const name = elName.value;

    if (!name) {
      Modal.addHint('Введите ваш псевдоним!', elName);
      return;
    }

    Modal.removeHint(elName);
    this.api.sendNickname(name, this.sendNicknameHandler.bind(this, elName));
  }

  sendNicknameHandler(element, data) {
    if (data.status === 'ok') {
      this.user = data.user;
      this.subscribeOnEvents();
      Modal.remove();
    } else {
      Modal.addHint(data.message, element);
    }
  }

  subscribeOnEvents() {
    this.websocket = new WebSocket('wss://ahj-homeworks-sse-ws-chat-backend-7gs4.onrender.com/');

    this.websocket.addEventListener('open', () => {
      this.renderChat();

      const form = document.querySelector('.form');
      form.addEventListener('submit', this.onEnterChatHandler);

      const disconnect = document.querySelector('.chat__connect');
      disconnect.addEventListener('click', () => {
        this.websocket.send(JSON.stringify({ type: 'exit', user: this.user }));
        this.websocket.close();
        this.container.innerHTML = '';
        this.init();
      });
    });

    this.websocket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);

      if (Array.isArray(data)) {
        this.users = data;
        this.renderUsers();
      } else {
        const chat = document.querySelector('.chat__messages-container');
        const message = this.renderMessage(data);
        chat.insertAdjacentHTML('beforeend', message);
      }

      console.log(e, data);
    });
  }

  onEnterChatHandler(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('.form__input');
    const msg = input.value;

    if (!msg) return;

    this.sendMessage(msg);
    input.value = '';
  }

  sendMessage(msg) {
    const json = JSON.stringify({
      type: 'send', msg, date: Date.now(), userId: this.user.id,
    });
    this.websocket.send(json);
  }

  renderMessage(data) {
    const isYou = data.userId === this.user.id ? ' message__container-yourself' : '';
    let { name } = this.users.filter((i) => i.id === data.userId)[0];

    if (name === this.user.name) {
      name = 'You';
    }

    return `
      <div class="message__container${isYou}">
        <div class="message__header">
          ${name}, ${new Date(data.date).toLocaleDateString(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})}
        </div>
        <div class="message__container-interlocutor">
          ${data.msg}
        </div>
      </div>
    `;
  }

  renderUsers() {
    const usersList = document.querySelector('.chat__userlist');
    usersList.innerHTML = '';

    this.users.forEach((user) => {
      const elUser = document.createElement('div');
      elUser.classList.add('chat__user');

      if (user.id === this.user.id) {
        elUser.classList.add('chat__user-yourself');
        elUser.innerText = 'You';
      } else {
        elUser.innerText = user.name;
      }

      usersList.appendChild(elUser);
    });
  }

  renderChat() {
    const html = `
      <div class="container">
        <div class="chat__header">
          <h1>Чат</h1>
          <div class="chat__connect">Отключиться</div>
        </div>
        <div class="chat__container">
          <div class="chat__userlist"></div>
          <div class="chat__area">
            <div class="chat__messages-container"></div>
            <div class="chat__messages-input">
              <form class="form">
                <div class="form__group">
                  <input type="text" class="form__input">
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    this.container.insertAdjacentHTML('beforeend', html);
  }
}
