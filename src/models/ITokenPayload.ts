export interface ITokenPayload {
  email: string;
  exp: Date;
  iat: Date;
  name: string;
  roles: string[];
  sub: string;
}
