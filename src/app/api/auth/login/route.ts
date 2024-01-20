import { LoginSchema } from "@/schemas";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  const validatedFields = LoginSchema.safeParse(reqBody);

  if (!validatedFields.success) {
    return new Response(JSON.stringify({ error: "Invalid fields!" }));
  } else {
    return new Response(JSON.stringify({ success: "Valid credentials!" }));
  }
}
