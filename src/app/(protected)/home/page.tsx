import { ImageCard } from "@/components/image-card";

export default function HomePage() {
  const images = [
    "https://pbs.twimg.com/media/GFKKWcsbEAAZhcd.jpg",
    "https://pbs.twimg.com/media/GFQWr8SbEAA_HQ9.jpg",
    "https://pbs.twimg.com/media/GFQTtPMbwAAlLGP.jpg",
    "https://pbs.twimg.com/media/GFQSk7masAAz88S.jpg",
    "https://pbs.twimg.com/media/GFQSHM8asAAqYQ5.jpg",
    "https://pbs.twimg.com/media/GFQO7SRawAAjKod.jpg",
    "https://pbs.twimg.com/media/GFQO6OTawAAaxpQ.jpg",
    "https://pbs.twimg.com/media/GFQBoMIbQAAfiFD.jpg",
    "https://pbs.twimg.com/media/GFP2paYbwAA6_zw.jpg",
    "https://pbs.twimg.com/media/GFPnxU2b0AAS8B4.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://i.imgur.com/1uK9lKd.jpeg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
  ];

  return (
    <div className="flex flex-row flex-wrap justify-center">
      {images.map((image) => (
        <ImageCard key={image} imageUrl={image} />
      ))}
    </div>
  );
}
