import { randomInt } from "crypto";
import { Resend } from "resend";

const CHARSET =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReadablePassword(length = 16) {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += CHARSET[randomInt(CHARSET.length)]!;
  }
  return s;
}

function appBaseUrl() {
  const u = process.env.AUTH_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return "http://localhost:3000";
}

export async function sendSignupPassword(to: string, password: string) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const from =
    process.env.EMAIL_FROM?.trim() ?? "Coinflow <onboarding@resend.dev>";
  const loginUrl = `${appBaseUrl()}/login`;
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Coinflow — your password",
    text: [
      "You registered on Coinflow.",
      "",
      `Password: ${password}`,
      "",
      `Log in: ${loginUrl}`,
      "",
      "Paper demo only — not a broker.",
    ].join("\n"),
  });
  if (error) {
    throw new Error(error.message);
  }
}
