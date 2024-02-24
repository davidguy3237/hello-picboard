import PostPage from "@/app/(public)/post/[id]/page";
import { InterceptModal } from "@/components/intercept-modal";

interface InterceptedPostPageProps {
  params: {
    id: string;
  };
}

export default function InterceptedPostPage({
  params,
}: InterceptedPostPageProps) {
  return (
    <InterceptModal>
      <PostPage params={params} />
    </InterceptModal>
  );
}
