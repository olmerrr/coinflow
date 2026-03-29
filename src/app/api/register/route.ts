import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { generateReadablePassword, sendSignupPassword } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = body as { email?: unknown; name?: unknown };
  const email =
    typeof o.email === "string" ? o.email.toLowerCase().trim() : "";
  const name = typeof o.name === "string" ? o.name.trim() : undefined;

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already registered" }, { status: 409 });
  }

  const plainPassword = generateReadablePassword();
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || null,
    },
  });

  try {
    await sendSignupPassword(email, plainPassword);
  } catch {
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    return Response.json(
      { error: "Could not send email. Check RESEND_API_KEY and EMAIL_FROM." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
