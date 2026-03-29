"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const inputBase =
  "mt-1 min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base text-slate-900 outline-none ring-blue-500/30 focus:ring-2 sm:text-sm";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const registered = searchParams.get("registered") === "1";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onValid(data: LoginValues) {
    setServerError(null);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      setServerError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col overflow-x-clip py-10 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:py-16 sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Log in</h1>
      {registered ? (
        <p
          className="mt-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-slate-700"
          role="status"
        >
          Check your inbox for the password, then sign in below.
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-600">
          Register to get a password by email, then sign in here.
        </p>
      )}
      <form
        onSubmit={handleSubmit(onValid)}
        className="mt-8 flex flex-col gap-4"
        noValidate
      >
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            autoComplete="email"
            className={`${inputBase} ${errors.email ? "border-red-300 focus:ring-red-200" : "border-sky-200"}`}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="login-email-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            className={`${inputBase} ${errors.password ? "border-red-300 focus:ring-red-200" : "border-sky-200"}`}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
          />
          {errors.password ? (
            <p id="login-password-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </label>
        {serverError ? (
          <p className="text-sm text-red-600" role="alert">
            {serverError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:bg-blue-700 hover:bg-blue-500 disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-700 underline-offset-2 hover:underline"
        >
          Register
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md flex-1 py-10 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] text-sm text-slate-500 sm:py-16 sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
          Loading…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
