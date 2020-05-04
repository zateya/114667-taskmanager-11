export const AUTHORIZATION = `Basic Sijf1de8ri39;lsd`;
export const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const ESCAPE_KEY_CODE = 27;

export const SHOWING_TASKS_COUNT_ON_START = 8;
export const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export const WEEK_DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

export const MIN_DESCRIPTION_LENGTH = 1;
export const MAX_DESCRIPTION_LENGTH = 140;

export const FILTER_ID_PREFIX = `filter__`;

export const NoTasksMessage = {
  LOADING: `Loading...`,
  ADD: ` Click «ADD NEW TASK» in menu to create your first task`
};

export const COLOR = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`
};

export const COLORS = Object.values(COLOR);

export const TaskControllerMode = {
  DEFAULT: `default`,
  ADDING: `adding`,
  EDIT: `edit`
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

export const MenuItem = {
  NEW_TASK: `control__new-task`,
  STATISTICS: `control__statistic`,
  TASKS: `control__task`
};

export const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`
};

export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};
