import moment from "moment";

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};
