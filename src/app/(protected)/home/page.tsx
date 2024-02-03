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
    // "https://i.imgur.com/1uK9lKd.jpeg",
    "https://pbs.twimg.com/media/GFLOAS0bIAAn4Jm.jpg",
    "https://pbs.twimg.com/media/GFYZc_OaUAAfx0-.jpg",
    "https://pbs.twimg.com/media/GFViyiyaMAAmDDa.jpg",
    "https://pbs.twimg.com/media/GFVX0TKbgAEOai4.jpg",
    "https://pbs.twimg.com/media/GFVW8t_bMAAvvTh.jpg",
    "https://pbs.twimg.com/media/GFVW8NYbsAAS5xh.jpg",
    "https://pbs.twimg.com/media/GFVVouBaQAA95V8.jpg",
    "https://pbs.twimg.com/media/GFT3Ae7aAAAaMD-.jpg",
    "https://pbs.twimg.com/media/GFTPZQabUAAETZ2.jpg",
    "https://pbs.twimg.com/media/GFQHlJOaYAAAH0b.jpg",
    "https://pbs.twimg.com/media/GFQDQQgbwAACR3V.jpg",
    "https://pbs.twimg.com/media/GFQDPG-bUAAxL1Z.jpg",
    "https://pbs.twimg.com/media/GFP5ZbFa8AEqB0o.jpg",
    "https://pbs.twimg.com/media/GFLC1fNa4AAeNwd.jpg",
    "https://pbs.twimg.com/media/GFLC1GubYAAzwFR.jpg",
  ];

  return (
    <div className="flex flex-row flex-wrap justify-center">
      {images.map((image) => (
        <ImageCard key={image} imageUrl={image} />
      ))}
    </div>
  );
}
