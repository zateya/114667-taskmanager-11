import AbstractComponent from "./abstract-component.js";
import {SortType} from "../constant.js";

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" data-sort-type="${SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" data-sort-type="${SortType.DATE_UP}" class="board__filter">SORT BY DATE up</a>
      <a href="#" data-sort-type="${SortType.DATE_DOWN}" class="board__filter">SORT BY DATE down</a>
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortType(sortType) {
    this._currentSortType = sortType;
  }

  reset() {
    this._currentSortType = SortType.DEFAULT;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
