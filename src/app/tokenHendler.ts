/* eslint-disable no-useless-escape */
import { ITokenPayload } from '../models/ITokenPayload';

function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default function getTokenPayload(): ITokenPayload | undefined {
  const base64Url = getCookie('accessToken')?.split('.')[1];
  if (!base64Url) {
    return undefined;
  }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(''),
  );

  return JSON.parse(jsonPayload) as ITokenPayload;
}
