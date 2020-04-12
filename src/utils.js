const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours24 = date.getHours();
  const suffix = hours24 > 12 ? `p.m.` : `a.m.`;
  const hours = castTimeFormat(hours24 % 12 || 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes} ${suffix}`;
};

export {render, getRandomArrayItem, getRandomDate, formatTime};
