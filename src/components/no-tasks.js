import AbstractComponent from "./abstract-component.js";

const createNoTasksTemplate = (message) => {
  return (
    `<p class="board__no-tasks">
      ${message}
    </p>`
  );
};

export default class NoTasks extends AbstractComponent {
  constructor(message) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createNoTasksTemplate(this._message);
  }
}
