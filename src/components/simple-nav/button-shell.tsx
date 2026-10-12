import { cn } from "cn";

export default function ButtonShell({
  children,
  col,
  backButton,
}: {
  children: React.ReactNode;
  col?: number;
  backButton?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-20 bg-gray-200">
      <div className={cn("grid gap-5", col ? `grid-cols-${col}` : "grid-cols-2")}>
        {backButton && <div className={cn("flex gap-5", col ? `col-span-${col}` : "col-span-2")}>{backButton}</div>}
        {children}
      </div>
    </div>
  );
}
