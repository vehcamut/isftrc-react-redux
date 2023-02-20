/* eslint-disable import/prefer-default-export */
export const addClass = (classes: any, ...cs: string[]): string =>
  cs.reduce((res, current) => (res === '' ? classes[current] : `${res} ${classes[current]}`), '');

export const greaterThenNowDate = (date: Date): boolean => {
  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
  const compDate = new Date(date).setHours(0, 0, 0, 0).valueOf();
  return compDate > nowDate;
};

export const equalThenNowDate = (date: Date): boolean => {
  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
  const compDate = new Date(date).setHours(0, 0, 0, 0).valueOf();
  return compDate === nowDate;
};
