import { RegisterSchema } from "@/schemas";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  const validatedFields = RegisterSchema.safeParse(reqBody);

  if (!validatedFields.success) {
    return new Response(JSON.stringify({ error: "Invalid fields!" }));
  }

  const { email, username, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return new Response(JSON.stringify({ error: "Email already in use!" }));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      email,
      name: username,
      password: hashedPassword,
    },
  });

  // TODO: Send verification token email

  return new Response(JSON.stringify({ success: "Account created!" }));
}
