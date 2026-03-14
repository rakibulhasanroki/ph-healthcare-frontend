"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";

import { ILoginResponse } from "@/types/auth.types";
import { LoginPayload, loginSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: LoginPayload,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Something went wrong!";
    return {
      success: false,
      message: firstError,
    };
  }
  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );
    const { accessToken, refreshToken, token } = response.data;

    await setTokenCookies("accessToken", accessToken);
    await setTokenCookies("refreshToken", refreshToken);
    await setTokenCookies("better-auth.session_token", token);

    redirect("/dashboard");
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return {
      success: false,
      message: `Login failed: ${error.response.data.message}`,
    };
  }
};

export const googleLoginAction = async () => {
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/google`;
  redirect(googleAuthUrl);
};
