import PostPage from "@/app/(public)/post/[id]/page";
import { Modal } from "@/components/image-modal";

interface PostModal {
  params: {
    id: string;
  };
}

export default function InterceptedPostPageAsModal({ params }: PostModal) {
  return (
    <Modal>
      <PostPage params={params} />
    </Modal>
  );
}
