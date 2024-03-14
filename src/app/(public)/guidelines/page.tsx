import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContentGuidelinesPage() {
  return (
    <Card className="m-4 max-w-screen-md px-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-center text-3xl">
          Content Guidelines
        </CardTitle>
        <CardDescription className="text-md">
          To ensure the highest quality and maintain the focus on Japanese
          idols, we have established the following content guidelines for
          uploads
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ol className="list-decimal space-y-4">
          <li>
            <strong>Image Quality:</strong> Uploaded images must be of high
            quality. Blurry, pixelated, or low-resolution images will not be
            accepted unless that is the only version that exists. Screenshots
            are also not accepted.
          </li>
          <li>
            <strong>Relevance:</strong> Ensure that uploaded images are relevant
            to the theme of Japanese idols. Off-topic or unrelated content may
            be subject to removal.
          </li>
          <li>
            <strong>Tag Creation:</strong> To ensure accurate and high quality
            tags are being used, please search for existing tags before creating
            a new one. When creating a new tag, if it is a name, be sure it is
            spelled properly, with surname/family name coming before first name.
          </li>
          <li>
            <strong>Respectful Content:</strong> Please ensure that all uploaded
            images are appropriate and respectful towards the idols and their
            fans. Any content that is offensive, explicit, or derogatory will be
            strictly prohibited.
          </li>
          <li>
            <strong>Non-Duplicate Content:</strong> To maintain a diverse
            collection of images, please avoid uploading duplicate images. If
            the image being uploaded is higher quality than what already exists,
            it will be accepted.
          </li>
          <li>
            <strong>Authenticity:</strong> Uploaded images must be unaltered.
            Avoid edited or manipulated images that distort the appearance of
            the Japanese idols. This includes AI upscaling.
          </li>
          <li>
            <strong>Consent and Privacy:</strong> Respect the privacy and
            personal boundaries of the Japanese idols. Do not upload images that
            violate their consent or invade their privacy.
          </li>
          <li>
            <strong>No Explicit Content:</strong> Images containing nudity,
            sexually explicit material, or graphic violence are strictly
            prohibited.
          </li>
          <li>
            <strong>No Hate Speech or Harassment:</strong> Users must refrain
            from posting images that promote hate speech, discrimination,
            harassment, or any form of bullying.
          </li>
          <li>
            <strong>Reporting Violations:</strong> Users are encouraged to
            report any violations of these guidelines promptly.
          </li>
          <li>
            <strong>Moderation and Compliance:</strong> All uploaded images will
            be reviewed to ensure they adhere to these guidelines. We reserve
            the right to remove or reject any content that violates these
            guidelines or is deemed inappropriate.
          </li>
        </ol>
        <p className="text-center font-bold">
          <br />
          These rules are subject to change at any time.
        </p>
      </CardContent>
    </Card>
  );
}
