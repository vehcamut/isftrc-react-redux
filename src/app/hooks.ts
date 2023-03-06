import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import getTokenPayload from './tokenHendler';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useUserRoles = () => {
  const payload = getTokenPayload()?.roles;
  if (!payload) return [] as Array<string>;
  return payload as Array<string>;
};
