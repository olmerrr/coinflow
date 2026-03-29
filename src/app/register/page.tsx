"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().max(120, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type RegisterValues = z.infer<typeof registerSchema>;

const inputBase =
  "mt-1 min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base text-slate-900 outline-none ring-blue-500/30 focus:ring-2 sm:text-sm";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "" },
  });

  async function onValid(data: RegisterValues) {
    setServerError(null);
    const name = data.name.trim() || undefined;
    const r = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: data.email }),
    });
    const json = (await r.json()) as { error?: string };
    if (!r.ok) {
      setServerError(json.error ?? "Registration failed");
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col overflow-x-clip py-10 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:py-16 sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        Register
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        We will send a generated password to your email. Paper demo only — not a
        real broker.
      </p>
      <form
        onSubmit={handleSubmit(onValid)}
        className="mt-8 flex flex-col gap-4"
        noValidate
      >
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Name (optional)
          </span>
          <input
            type="text"
            autoComplete="name"
            className={`${inputBase} ${errors.name ? "border-red-300 focus:ring-red-200" : "border-sky-200"}`}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <p id="register-name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            autoComplete="email"
            className={`${inputBase} ${errors.email ? "border-red-300 focus:ring-red-200" : "border-sky-200"}`}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="register-email-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.email.message}
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
          {isSubmitting ? "Sending…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-700 underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
