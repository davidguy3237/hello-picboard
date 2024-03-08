import { Navbar } from "@/components/navbar/navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function PublicLayout({ children, modal }: PublicLayoutProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <Navbar />
      {children}
      {modal}
    </div>
  );
}
