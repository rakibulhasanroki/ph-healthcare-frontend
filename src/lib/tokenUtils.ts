import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

const getTokenSecondRemainTime = (token: string) => {
  if (!token) return 0;

  try {
    const payload = jwt.decode(token) as JwtPayload | null;

    if (!payload?.exp) return 0;

    const remaining = payload.exp - Math.floor(Date.now() / 1000);

    return remaining > 0 ? remaining : 0;
  } catch (err) {
    console.error("Token decode error", err);
    return 0;
  }
};

export const setTokenCookies = async (
  name: string,
  token: string,
  fallbackMaxAgeInSeconds?: number,
) => {
  const maxAgeInSeconds = getTokenSecondRemainTime(token);
  await setCookie(
    name,
    token,
    maxAgeInSeconds || fallbackMaxAgeInSeconds || 24 * 60 * 60,
  );
};

export const isTokenExpiredSoon = async (
  token: string,
  threshold = 300,
): Promise<boolean> => {
  const remaining = getTokenSecondRemainTime(token);
  return remaining > 0 && remaining <= threshold;
};

export const isTokenExpired = async (token: string): Promise<boolean> => {
  const remaining = getTokenSecondRemainTime(token);
  return remaining === 0;
};
