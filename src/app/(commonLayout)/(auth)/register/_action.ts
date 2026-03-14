/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IRegisterResponse } from "@/types/auth.types";
import { RegisterPayload, RegisterSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const RegisterAction = async (
  payload: RegisterPayload,
): Promise<IRegisterResponse | ApiErrorResponse> => {
  const parsedPayload = RegisterSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Something went wrong!";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      parsedPayload.data,
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Register failed: ${error.response?.data?.message}`,
    };
  }
};

export const googleLoginAction = async () => {
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/google`;
  redirect(googleAuthUrl);
};
