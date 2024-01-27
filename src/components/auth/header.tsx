import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
}

export function Header({ label }: HeaderProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className={cn("text-3xl font-bold")}>Auth</h1>
      <p className="text-sm  text-muted-foreground">{label}</p>
    </div>
  );
}
