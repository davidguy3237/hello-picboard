import {
  Dialog,
  InterceptedDialogContentForPost,
} from "@/components/ui/dialog";

interface PostInterceptModalProps {
  children: React.ReactNode;
}

export function PostInterceptModal({ children }: PostInterceptModalProps) {
  return (
    <Dialog open>
      <InterceptedDialogContentForPost>
        {children}
      </InterceptedDialogContentForPost>
    </Dialog>
  );
}
