import SiteMenuComponent from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import {render} from "./utils/render.js";
import TasksModel from "./models/tasks.js";
import {generateTasks} from "./mock/task.js";
import {TASKS_COUNT, MenuItem} from "./constant.js";

const tasks = generateTasks(TASKS_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const siteMenuComponent = new SiteMenuComponent();
render(siteHeaderElement, siteMenuComponent);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.show();
      boardController.createTask();
      break;
  }
});
