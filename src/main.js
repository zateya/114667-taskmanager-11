import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import {render} from "./utils/render.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";

const TASKS_COUNT = 24;

const filters = generateFilters();
const tasks = generateTasks(TASKS_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent());
render(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent);
boardController.render(tasks);
