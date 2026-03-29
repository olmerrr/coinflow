function pick(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : undefined;
}

export function getAuthSecret(): string | undefined {
  return (
    pick("AUTH_SECRET") ??
    pick("NEXTAUTH_SECRET") ??
    (process.env.NODE_ENV === "development"
      ? "coinflow-local-dev-secret-32chars-min!!"
      : undefined)
  );
}
