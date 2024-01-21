import { LoginSchema } from "@/schemas";
import { NextRequest } from "next/server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  const validatedFields = LoginSchema.safeParse(reqBody);

  if (!validatedFields.success) {
    return new Response(JSON.stringify({ error: "Invalid fields!" }));
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return new Response(JSON.stringify({ success: "Login success!" }));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return new Response(
            JSON.stringify({ error: "Invalid credentials!" }),
          );
        default:
          return new Response(
            JSON.stringify({ error: "Something went wrong!" }),
          );
      }
    }
    if (isRedirectError(error)) {
      console.log("INSIDE REDIRECT ERROR");
      throw error;
    }
    console.log("WHAT IS HAPPENING");
    console.log(error);
    throw error;
  }
}
