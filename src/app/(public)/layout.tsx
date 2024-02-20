import { Navbar } from "@/components/navbar/navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className=" flex h-full w-full flex-col items-center">
      <Navbar />
      {children}
    </div>
  );
}
