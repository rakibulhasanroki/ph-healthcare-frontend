"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RegisterSchema, RegisterPayload } from "@/zod/auth.validation";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  googleLoginAction,
  RegisterAction,
} from "@/app/(commonLayout)/(auth)/register/_action";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (payload: RegisterPayload) => RegisterAction(payload),
    retry: false,
  });

  const { mutate: googleLogin, isPending: googlePending } = useMutation({
    mutationFn: async () => {
      await googleLoginAction();
    },
    retry: false,
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Register Failed!");
          return;
        }
        router.replace("/verify-email?email=" + value.email);
      } catch (error: any) {
        setServerError(error.message || "Register Failed!");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto border shadow-sm rounded-2xl">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-center text-2xl font-semibold">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Sign up with your email
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* Name */}
          <form.Field
            name="name"
            validators={{ onChange: RegisterSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Name"
                placeholder="Enter your name"
              />
            )}
          </form.Field>

          {/* Email */}
          <form.Field
            name="email"
            validators={{ onChange: RegisterSchema.shape.email }}
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
            validators={{ onChange: RegisterSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
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

          {/* Confirm Password */}
          <form.Field name="confirmPassword">
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton isPending={isSubmitting} disabled={!canSubmit}>
                Register
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        {/* google signup options */}
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
          {googlePending ? "Redirecting..." : "Continue with Google"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
