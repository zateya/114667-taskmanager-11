import AbstractComponent from "./abstract-component.js";

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" data-sort-type="default" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" data-sort-type="date-up" class="board__filter">SORT BY DATE up</a>
      <a href="#" data-sort-type="date-down" class="board__filter">SORT BY DATE down</a>
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  getTemplate() {
    return createSortTemplate();
  }
}
