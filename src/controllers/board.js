import SortComponent from "../components/sort.js";
import TaskController from "./task.js";
import TasksComponent from "../components/tasks.js";
import NoTasksComponent from "../components/no-tasks.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {render, remove} from "../utils/render.js";
import {SHOWING_TASKS_COUNT_ON_START, SHOWING_TASKS_COUNT_BY_BUTTON, SortType, TaskControllerMode, EmptyTask, NoTasksMessage} from '../constant.js';

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);

    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container, tasksModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._api = api;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._preloadComponent = null;
    this._noTasksComponent = new NoTasksComponent(NoTasksMessage.ADD);
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._creatingTask = null;
    this._isNoTasksShown = false;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  preload() {
    this._preloadComponent = new NoTasksComponent(NoTasksMessage.LOADING);
    render(this._container.getElement(), this._preloadComponent);
  }

  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    remove(this._preloadComponent);

    if (isAllTasksArchived || tasks.length === 0) {
      render(container, this._noTasksComponent);
      this._isNoTasksShown = true;
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  _renderNoTasks() {
    const container = this._container.getElement();
    remove(this._sortComponent);
    remove(this._tasksComponent);
    render(container, this._noTasksComponent);
    this._isNoTasksShown = true;
  }

  _renderBoard() {
    const container = this._container.getElement();
    remove(this._noTasksComponent);
    render(container, this._sortComponent);
    render(container, this._tasksComponent);
    this._isNoTasksShown = false;
  }

  _resetFilters() {
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._sortComponent.setSortType(SortType.DEFAULT);
    this._tasksModel.resetFilter();
    this._updateTasks(this._showingTasksCount);
  }

  createTask() {
    if (this._showedTaskControllers.length === 0) {
      this._renderBoard();
    }

    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();

    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);

    this._resetFilters();
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    const taskListElement = this._tasksComponent.getElement();
    this._showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;
    const tasks = this._tasksModel.getTasks();

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._api.createTask(newData)
          .then((taskModel) => {
            this._tasksModel.addTask(taskModel);
            taskController.render(taskModel, TaskControllerMode.DEFAULT);

            if (this._showingTasksCount % SHOWING_TASKS_COUNT_BY_BUTTON === 0) {
              const destroyedTask = this._showedTaskControllers.pop();
              destroyedTask.destroy();
            }

            this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
            this._showingTasksCount = this._showedTaskControllers.length;

            this._renderLoadMoreButton();
          })
          .catch(() => {
            taskController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteTask(oldData.id)
        .then(() => {
          this._tasksModel.removeTask(oldData.id);
          this._updateTasks(this._showingTasksCount);
        })
        .then(() => {
          if (this._showingTasksCount === 0) {
            this._renderNoTasks();
          }
        })
        .catch(() => {
          taskController.shake();
        });
    } else {
      this._api.updateTask(oldData.id, newData)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel);

          if (isSuccess) {
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
            this._updateTasks(this._showingTasksCount);
          }
        })
        .catch(() => {
          taskController.shake();
        });
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    this._renderLoadMoreButton();
  }

  _onFilterChange() {
    if (this._isNoTasksShown) {
      this._renderBoard();
    }

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._sortComponent.setSortType(SortType.DEFAULT);
    this._updateTasks(this._showingTasksCount);
  }
}
