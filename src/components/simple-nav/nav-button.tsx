import { Card } from "@/components/shadcn/card";
import { cn } from "cn";
import { LucideIcon } from "lucide-react";
import { Route } from "next";
import Link from "next/link";

export default function NavButton({
  icon,
  href,
  size = "default",
  children,
}: {
  icon?: LucideIcon;
  size?: "sm" | "lg" | "default" | "icon";
  href: Route;
  children: React.ReactNode;
}) {
  const Icon = icon;
  return (
    <Link href={href}>
      <Card
        className={cn(
          "border-2 p-4 text-center hover:bg-stone-200 flex-row items-center justify-center h-30 cursor-pointer",
          size === "sm" && "w-xs",
          size === "default" && "w-sm",
          size === "lg" && "w-md",
          size === "icon" && "w-40",
        )}
      >
        {Icon && <Icon size={30} />}
        <p className="text-2xl">{children}</p>
      </Card>
    </Link>
  );
}
