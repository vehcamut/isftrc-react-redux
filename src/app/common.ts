/* eslint-disable import/prefer-default-export */
export const addClass = (classes: any, ...cs: string[]): string =>
  cs.reduce((res, current) => (res === '' ? classes[current] : `${res} ${classes[current]}`), '');
