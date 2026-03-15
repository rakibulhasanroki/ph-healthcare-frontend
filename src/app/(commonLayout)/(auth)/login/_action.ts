"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";

import { ILoginResponse } from "@/types/auth.types";
import { LoginPayload, loginSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: LoginPayload,
  redirectPath?: string,
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
    const { accessToken, refreshToken, token, user } = response.data;
    const { role, needsPasswordChange, email } = user;

    await setTokenCookies("accessToken", accessToken);
    await setTokenCookies("refreshToken", refreshToken);
    await setTokenCookies("better-auth.session_token", token);

    if (needsPasswordChange) {
      // TODO: refactor later
      redirect(`/reset-password?email=${email}`);
    } else {
      const finalPath =
        redirectPath && isValidRedirectForRole(role as UserRole, redirectPath)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);
      redirect(finalPath);
    }
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
    if (error.response?.data?.message === "Email not verified") {
      redirect("/verify-email");
    }
    return {
      success: false,
      message: `Login failed: ${error.response?.data?.message}`,
    };
  }
};

export const googleLoginAction = async () => {
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/google`;
  redirect(googleAuthUrl);
};
