import LoginPage from "@/app/(auth)/login/page";
import { InterceptModal } from "@/components/intercept-modal";

export default function InterceptedLoginPage() {
  return (
    <InterceptModal>
      <LoginPage />
    </InterceptModal>
  );
}
