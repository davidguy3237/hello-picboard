import { Navbar } from "@/components/navbar/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className=" flex h-full w-full flex-col items-center px-64 pt-16">
      <Navbar />
      {children}
    </div>
  );
}
