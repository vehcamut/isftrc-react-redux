export interface ITokenPayload {
  email: string;
  exp: Date;
  iat: Date;
  roles: string[];
  sub: string;
}
