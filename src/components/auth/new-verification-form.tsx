"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });

    // TODO: Do not understand why it is being run multiple times, investigate later
    // console.log("INSIDE USECALLBACK");
    // if (success || error) {
    //   console.log("THERE IS ALREADY A SUCCESS OR ERROR");
    // } else if (!token) {
    //   console.log("THERE IS NO TOKEN");
    //   setError("Missing token!");
    // } else {
    //   console.log("THERE IS NO SUCCESS/ERROR AND THERE IS A TOKEN");
    //   newVerification(token)
    //     .then((data) => {
    //       console.log("UPDATING STATUS");
    //       setSuccess(data.success);
    //       setError(data.error);
    //     })
    //     .catch(() => {
    //       console.log("DID SOMETHING GO WRONG VERIFYING TOKEN?");
    //       setError("Something went wrong!");
    //     });
    // }
  }, [token]);

  useEffect(() => {
    // TODO: check if useEffect still multiple times during production
    // console.log("INSIDE USE EFFECT");
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <Loader2 className="h-8 w-8 animate-spin" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
}
