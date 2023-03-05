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

export const mutationHandler = async (mutation: any, params: any, messageApi: any, content: any, type = 'success') => {
  try {
    const result = await mutation(params).unwrap();
    messageApi.open({
      type,
      content,
    });
    return result;
  } catch (e: any) {
    if (e?.data?.message) {
      messageApi.open({
        type: 'error',
        content: e?.data?.message,
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  }
  return 'ERROR';
};

export const mutationErrorHandler = (messageApi: any, event: any) => {
  if (event?.data?.message) {
    messageApi.open({
      type: 'error',
      content: event?.data?.message,
    });
  } else {
    messageApi.open({
      type: 'error',
      content: 'Ошибка связи с сервером',
    });
  }
};
