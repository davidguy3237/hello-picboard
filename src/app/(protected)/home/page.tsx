import { ImageCard } from "@/components/image-card";
import { exampleImages } from "../../../../dummydata";

export default function HomePage() {
  return (
    <div className="flex max-w-screen-2xl flex-row flex-wrap justify-center">
      {exampleImages.map((image) => (
        <ImageCard key={image} imageUrl={image} />
      ))}
    </div>
  );
}
