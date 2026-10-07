"use client";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { InputGroup, InputGroupInput } from "@/components/shadcn/input-group";
import { useActionState, useRef } from "react";
import { userRegisterSchema } from "@/features/auth/auth.schema";
import { registerAction } from "@/actions/auth/register.action";
import { loginAction } from "@/actions/auth/login.actions";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { APP_URLS } from "@/constraints/url";
import PasswordInput from "./password-input";
import zod from "zod";

type FormState = {
  // Used to avoid base UI error saying we cant change the default value after component rendered
  formKey: number;
  data: {
    username: string;
    password: string;
    confirmPassword: string;
  };
  errors?: {
    username?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export function LoginCard({ create = false }: { create?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialFormState: FormState = {
    formKey: 1,
    data: { username: "", password: "", confirmPassword: "" },
  };

  async function handleAction(preState: FormState, formData: FormData): Promise<FormState> {
    const formKey = preState.formKey + 1;
    const username = (formData.get("username") ?? "") as string;
    const password = (formData.get("password") ?? "") as string;
    const confirmPassword = (formData.get("confirmPassword") ?? "") as string;

    if (!username || !password || (create && !confirmPassword)) {
      return {
        ...initialFormState,
        errors: {
          username: "Username is required",
          password: "Password is required",
          confirmPassword: "Please confirm your password",
        },
      };
    }

    if (create) {
      const result = userRegisterSchema.safeParse({ username, password });

      if (!result.success) {
        const { fieldErrors } = zod.flattenError(result.error);

        return {
          formKey,
          data: { username, password, confirmPassword },
          errors: {
            username: fieldErrors.username ? fieldErrors.username[0] : "",
            password: fieldErrors.password ? fieldErrors.password[0] : "",
          },
        };
      }

      if (password !== confirmPassword) {
        return {
          formKey,
          data: { username, password, confirmPassword },
          errors: {
            confirmPassword: "Passwords do not match",
          },
        };
      }

      const res = await registerAction({ username, password });

      if (res.success) {
        toast.success(res.message);
        redirect(APP_URLS.dashboard);
      } else {
        toast.error(res.message);
        return {
          formKey,
          data: { username, password, confirmPassword },
        };
      }
    }

    const res = await loginAction(username, password);
    if (res.success) {
      toast.success(res.message);
      redirect(APP_URLS.dashboard);
    } else {
      toast.error(res.message);
      return {
        formKey,
        data: { username, password, confirmPassword },
      };
    }
  }

  const [formState, formAction, isPending] = useActionState<FormState, FormData>(handleAction, initialFormState);

  return (
    <div key={formState.formKey} className="flex w-full h-dvh items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{create ? "Create Admin Account" : "Login"}</CardTitle>
          <CardDescription>{create ? "Create a new admin account" : "Enter your credentials to login"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    autoComplete="off"
                    name="username"
                    placeholder="Enter your username"
                    defaultValue={formState.data.username}
                    aria-invalid={!!formState.errors?.username}
                    required
                  />
                </InputGroup>
                {create && <FieldDescription>You cannot change your username later</FieldDescription>}
                {create && formState.errors?.username && <FieldError>{formState.errors.username}</FieldError>}
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <PasswordInput
                  name="password"
                  defaultValue={formState.data.password}
                  aria-invalid={!!formState.errors?.password}
                  required
                />
                {formState.errors?.password && <FieldError>{formState.errors.password}</FieldError>}
              </Field>
              {create && (
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <PasswordInput
                    name="confirmPassword"
                    defaultValue={formState.data.confirmPassword}
                    aria-invalid={!!formState.errors?.confirmPassword}
                    required
                  />
                  {formState.errors?.confirmPassword && <FieldError>{formState.errors.confirmPassword}</FieldError>}
                </Field>
              )}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isPending}
            type="submit"
            className={"w-full"}
            onClick={() => (isPending ? undefined : formRef.current?.requestSubmit())}
          >
            {create ? "Create admin account" : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
