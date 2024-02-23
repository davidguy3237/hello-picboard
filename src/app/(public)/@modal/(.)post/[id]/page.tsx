import PostPage from "@/app/(public)/post/[id]/page";
import { PostModal } from "@/components/post-modal";

interface PostModal {
  params: {
    id: string;
  };
}

export default function InterceptedPostPageAsModal({ params }: PostModal) {
  return (
    <PostModal>
      <PostPage params={params} />
    </PostModal>
  );
}
