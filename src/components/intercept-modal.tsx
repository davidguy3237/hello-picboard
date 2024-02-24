import { Dialog, InterceptedDialogContent } from "./ui/dialog";

interface PostModalProps {
  children: React.ReactNode;
}
export function InterceptModal({ children }: PostModalProps) {
  return (
    <Dialog open>
      <InterceptedDialogContent>{children}</InterceptedDialogContent>
    </Dialog>
  );
}
