/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { setTokenCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

export async function getNewTokenWithRefreshToken(refreshToken: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    if (!response.ok) {
      return false;
    }
    const { data } = await response.json();
    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) {
      await setTokenCookies("accessToken", accessToken);
    }
    if (newRefreshToken) {
      await setTokenCookies("refreshToken", newRefreshToken);
    }
    if (token) {
      await setTokenCookies("better-auth.session_token", token, 24 * 60 * 60);
    }
    return true;
  } catch (error: any) {
    console.error("Refresh token error", error);
    return false;
  }
}

export async function getUserInfo() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const token = cookieStore.get("better-auth.session_token")?.value;
  if (!token) {
    return null;
  }
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}; better-auth.session_token=${token}`,
    },
  });
  if (!response.ok) {
    return false;
  }
  const { data } = await response.json();
  return data;
}
