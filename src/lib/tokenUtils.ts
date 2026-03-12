/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN;
const getTokenSecondRemainTime = (token: string) => {
  if (!token) return 0;
  try {
    const tokenPayload = JWT_ACCESS_SECRET
      ? (jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload)
      : (jwt.decode(token) as JwtPayload);
    if (tokenPayload && !tokenPayload.exp) {
      return 0;
    }

    const remainingSeconds =
      (tokenPayload.exp as number) - Math.floor(Date.now() / 1000);
    return remainingSeconds > 0 ? remainingSeconds : 0;
  } catch (error: any) {
    console.log("Error decoding token", error);
    return 0;
  }
};

export const setTokenCookies = async (name: string, token: string) => {
  const maxAgeInSeconds = getTokenSecondRemainTime(token);
  await setCookie(name, token, maxAgeInSeconds);
};
