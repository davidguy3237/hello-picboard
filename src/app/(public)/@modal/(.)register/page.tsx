import RegisterPage from "@/app/(auth)/register/page";
import { InterceptModal } from "@/components/intercept-modal";

export default function InterceptedRegisterPage() {
  return (
    <InterceptModal>
      <RegisterPage />
    </InterceptModal>
  );
}
