import { CardWrapper } from "@/components/auth/card-wrapper";

export function LoginForm() {
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    >
      Login Form Component
    </CardWrapper>
  );
}
