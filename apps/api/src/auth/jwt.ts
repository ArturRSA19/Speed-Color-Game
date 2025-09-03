import * as jwt from "jsonwebtoken";
import { env } from "../env";

export interface JwtPayload {
  sub: string; // userId
  email: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(
    payload, 
    env.JWT_SECRET as string, 
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
}
