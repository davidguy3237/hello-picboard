import { ImageCard } from "@/components/image-card";

export default function HomePage() {
  const images = [
    "https://source.unsplash.com/birds-eye-view-photograph-of-green-mountains-01_igFr7hd4",
    "https://source.unsplash.com/a-waterfall-in-the-middle-of-a-lush-green-forest-J6Fdqeb0Vcs",
    "https://source.unsplash.com/an-aerial-view-of-a-body-of-water-surrounded-by-land-q59v7fPcBsw",
    "https://source.unsplash.com/gray-concrete-bridge-and-waterfalls-during-daytime-cssvEZacHvQ",
    "https://source.unsplash.com/silhouette-of-trees-near-body-of-water-during-sunset-lsoogGC_5dg",
    "https://source.unsplash.com/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4",
    "https://source.unsplash.com/foggy-mountain-summit-1Z2niiBPg5A",
    "https://source.unsplash.com/a-tree-that-is-standing-in-the-water-3mKdu700JpY",
    "https://source.unsplash.com/landmark-photography-of-trees-near-rocky-mountain-under-blue-skies-daytime-ndN00KmbJ1c",
    "https://source.unsplash.com/forest-trees-jFCViYFYcus",
    "https://source.unsplash.com/a-lush-green-forest-filled-with-lots-of-trees-fWBZ9r4vO9M",
    "https://source.unsplash.com/selective-focus-photo-of-green-vine-h5wvMCdOV3w",
    "https://source.unsplash.com/a-mountain-with-a-green-aurora-light-in-the-sky-2KuUAJOxz_U",
    "https://source.unsplash.com/a-view-of-the-night-sky-over-a-body-of-water-xQv9jeYdZiA",
    "https://source.unsplash.com/a-sunset-view-of-a-mountain-range-with-pink-clouds-YvpLGlwNISY",
    "https://source.unsplash.com/blue-and-brown-steel-bridge-eOpewngf68w",
    "https://source.unsplash.com/silhouette-of-plant-during-sunset-xg8z_KhSorQ",
    "https://source.unsplash.com/orange-flowers-IicyiaPYGGI",
    "https://source.unsplash.com/waves-of-body-of-water-splashing-on-sand-mBQIfKlvowM",
    "https://source.unsplash.com/a-mossy-forest-with-lots-of-trees-and-plants-UN2FmopaxdI",
    "https://source.unsplash.com/body-of-water-on-beach-shore-9K9ipjhDdks",
    "https://source.unsplash.com/selrctive-focus-of-white-flowers-i9Q9bc-WgfE",
    "https://source.unsplash.com/the-sun-is-shining-over-the-water-and-rocks-CIuhewxFdxU",
    "https://source.unsplash.com/trees-under-cloudy-sky-during-sunset--G3rw6Y02D0",
    "https://source.unsplash.com/landscape-photography-of-black-mountain-y2azHvupCVo",
    "https://source.unsplash.com/a-green-and-blue-sky-filled-with-stars-a6a0aJfzxBQ",
    "https://source.unsplash.com/photo-of-two-mountains-lpjb_UMOyx8",
    "https://source.unsplash.com/selective-focus-photography-of-blue-kingfisher-vUNQaTtZeOo",
    "https://source.unsplash.com/a-view-of-a-mountain-range-with-a-forest-in-the-distance-ZW0C8TlPG_A",
    "https://source.unsplash.com/body-of-water-wave-photo-during-golden-time-mOcdke2ZQoE",
    "https://source.unsplash.com/closeup-photo-of-yellow-petaled-flowers-6-C0VRsagUw",
    "https://source.unsplash.com/a-large-wave-is-coming-in-to-the-ocean-Ba0GMWMBnd0",
    "https://source.unsplash.com/silhouette-of-person-standing-on-rock-surrounded-by-body-of-water-odxB5oIG_iA",
    "https://source.unsplash.com/moon-near-mountain-ridge-jCL98LGaeoE",
    "https://source.unsplash.com/body-of-water-under-sky-6ArTTluciuA",
    "https://source.unsplash.com/a-mountain-is-shown-with-a-lake-in-front-of-it-9pYZWuU7sc8",
    "https://source.unsplash.com/a-close-up-of-a-lizard-on-the-ground-XykVSjPQJzQ",
    "https://source.unsplash.com/low-angle-photography-of-trees-at-daytime-4rDCa5hBlCs",
    "https://source.unsplash.com/empty-road-between-trees-on-forest-v4e3JI7DDHI",
    "https://source.unsplash.com/a-woman-riding-a-wave-on-top-of-a-surfboard-CEEbQMPqlGY",
    "https://source.unsplash.com/boat-docked-near-house-VowIFDxogG4",
    "https://source.unsplash.com/birds-eye-view-photography-of-trees-and-body-of-water-mawU2PoJWfU",
    "https://source.unsplash.com/people-on-top-of-hill-under-white-clouds-golden-hour-photography-CakC6u4d95g",
  ];

  return (
    <div className="flex flex-row flex-wrap justify-center">
      {images.map((image) => (
        <ImageCard key={image} imageUrl={image} />
      ))}
    </div>
  );
}
