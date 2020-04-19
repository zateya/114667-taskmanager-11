import SortComponent from "../components/sort.js";
import TasksComponent from "../components/tasks.js";
import NoTasksComponent from "../components/no-tasks.js";
import TaskComponent from "../components/task.js";
import TaskEditComponent from "../components/task-edit.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {render, replace, remove} from "../utils/render.js";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent);
};

export default class BoardController {
  constructor (container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent =  new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

        tasks.slice(prevTasksCount, showingTasksCount)
          .forEach((task) => renderTask(taskListElement, task));

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    tasks.slice(0, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    renderLoadMoreButton();
  }
}
