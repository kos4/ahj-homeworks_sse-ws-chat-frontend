import Entity from './Entity';

export default class ChatAPI extends Entity {
  sendNickname(name, callback) {
    this.create(name, callback);
  }
}
