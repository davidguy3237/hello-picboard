import { Navbar } from "@/components/navbar/navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
  auth: React.ReactNode;
}

export default function PublicLayout({
  children,
  modal,
  auth,
}: PublicLayoutProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <Navbar />
      {children}
      {modal}
      {auth}
    </div>
  );
}
