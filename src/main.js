import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createBoardTemplate} from "./components/board.js";
import {createTaskEditTemplate} from "./components/task-edit.js";
import {createTaskTemplate} from "./components/task.js";
import {createLoadMoreButtonTemplate} from "./components/load-more-button.js";

const TASKS_COUNT = 3;
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

render(taskListElement, createTaskEditTemplate());

const taskTemplate = createTaskTemplate();
const taskListTemplate = taskTemplate.repeat(TASKS_COUNT);
render(taskListElement, taskListTemplate);

render(boardElement, createLoadMoreButtonTemplate());
