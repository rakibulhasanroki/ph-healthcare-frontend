"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  googleLoginAction,
  loginAction,
} from "@/app/(commonLayout)/(auth)/login/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginPayload, loginSchema } from "@/zod/auth.validation";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (payload: LoginPayload) => loginAction(payload),
  });

  const { mutateAsync: googleLogin, isPending: googlePending } = useMutation({
    mutationFn: async () => {
      await googleLoginAction();
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Login Failed!");
          return;
        }
      } catch (error: any) {
        console.log(`Login failed: ${error.message}`);
        setServerError(error.message || "Login Failed!");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto border shadow-sm rounded-2xl">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-center text-2xl font-semibold tracking-tight">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Sign in with your email and password
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* Email */}
          <form.Field
            name="email"
            validators={{ onChange: loginSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          {/* Password */}
          <form.Field
            name="password"
            validators={{ onChange: loginSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                aria-label={showPassword ? "Hide Password" : "Show Password"}
                append={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {/* Forgot */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting}
                disabled={!canSubmit}
                className="cursor-pointer"
              >
                Login
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        {/* Divider */}
        <div className="relative flex items-center">
          <span className="grow border-t" />
          <span className="mx-3 text-xs uppercase text-muted-foreground">
            Or continue with
          </span>
          <span className="grow border-t" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 gap-2 font-medium"
          disabled={googlePending}
          onClick={() => googleLogin()}
        >
          <FcGoogle className="size-4" />
          {googlePending ? "Redirecting..." : "Login with Google"}
        </Button>

        {/* Signup  */}
        <div className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
