import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  // TODO: maybe combine the components into these pages instead of keeping them separate
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
