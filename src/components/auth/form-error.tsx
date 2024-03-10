import { AlertTriangleIcon } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive dark:bg-red-950 dark:text-red-200">
      <AlertTriangleIcon className="h-6 w-6" />
      <p>{message}</p>
    </div>
  );
}
