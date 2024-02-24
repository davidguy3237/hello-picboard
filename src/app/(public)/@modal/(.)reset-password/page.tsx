import ResetPasswordPage from "@/app/(auth)/reset-password/page";
import { InterceptModal } from "@/components/intercept-modal";

export default function InterceptedResetPasswordPage() {
  return (
    <InterceptModal>
      <ResetPasswordPage />
    </InterceptModal>
  );
}
