import { CardWrapper } from "@/components/auth/card-wrapper";
import { BsExclamationTriangle } from "react-icons/bs";

export function ErrorCard() {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full justify-center">
        <BsExclamationTriangle className="text-destructive" />
      </div>
    </CardWrapper>
  );
}
