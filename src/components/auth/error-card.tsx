import { CardWrapper } from "@/components/auth/card-wrapper";
import { BsExclamationTriangle } from "react-icons/bs";

export function ErrorCard() {
  return (
    <CardWrapper
      headerTitle="Error"
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full justify-center">
        <BsExclamationTriangle className="h-8 w-8 text-destructive" />
      </div>
    </CardWrapper>
  );
}
