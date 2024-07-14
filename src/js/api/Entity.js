import createRequest from './createRequest';

export default class Entity {
  constructor(url) {
    this.url = url;
  }

  create(name, callback) {
    createRequest({
      input: `${this.url}new-user`,
      init: {
        method: 'POST',
        body: JSON.stringify({ name }),
      },
      callback,
    });
  }
}
