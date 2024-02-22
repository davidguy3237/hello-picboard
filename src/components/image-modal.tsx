/* eslint-disable @next/next/no-img-element */
import { Dialog, InterceptedDialogContent } from "./ui/dialog";

interface ModalProps {
  children: React.ReactNode;
}
export function Modal({ children }: ModalProps) {
  return (
    <Dialog open>
      <InterceptedDialogContent>{children}</InterceptedDialogContent>
    </Dialog>
  );
}
