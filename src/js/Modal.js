export default class Modal {
  static init() {
    const body = document.querySelector('body');
    const markup = `
      <div class="modal__background">
        <div class="modal__content">
          <div class="modal__header">Выберите псевдоним</div>
          <div class="modal__body">
            <form class="modal__form">
              <div class="form__group">
                <label class="form__label" for="name"></label>
                <input class="form__input" name="name" id="name">
              </div>
              <div class="form__group">
                <button class="modal__ok">Продолжить</button>
              </div>
            </form>
          </div>
          <div class="modal__footer"></div>
        </div>
      </div>
    `;

    body.insertAdjacentHTML('beforeend', markup);
  }

  static remove() {
    const modal = document.querySelector('.modal__background');

    if (modal) {
      modal.remove();
    }
  }

  static addHint(message, element) {
    element.insertAdjacentHTML('beforebegin', `<div class="form__hint">${message}</div>`);
  }

  static removeHint(element) {
    const parent = element.parentElement;
    parent.querySelectorAll('.form__hint').forEach((el) => el.remove());
  }
}
