import { Metadata } from "next";

interface UploadLayout {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Upload - Hello! Picboard",
};

export default async function UploadLayout({ children }: UploadLayout) {
  return <>{children}</>;
}
