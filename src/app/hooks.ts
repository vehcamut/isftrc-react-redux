import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import getTokenPayload from './tokenHendler';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useUserRoles = () => {
  // some logic or api call to get the roles
  // for demonstration purposes it's just hard coded
  // const userRoles: Array<typeof UserRoles[number]> = ['admin', 'root'];
  const payload = getTokenPayload()?.roles;
  if (!payload) return [] as Array<string>;
  // const userRoles: Array<string> = ;
  // return the current user roles
  return payload as Array<string>;
};
