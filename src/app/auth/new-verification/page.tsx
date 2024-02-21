import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

export default function NewVerificationPage() {
  return (
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
}
