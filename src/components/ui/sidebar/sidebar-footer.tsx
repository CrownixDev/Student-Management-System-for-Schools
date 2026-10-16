import { buttonVariants } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { SidebarFooter } from "@/components/shadcn/sidebar";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function AppSidebarFooter() {
  return (
    <SidebarFooter>
      <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
        <HomeIcon />
        Go Home
      </Link>
      <Separator />
      <p className="text-xs text-sidebar-foreground/60 text-center">A Project by CROWNIX</p>
    </SidebarFooter>
  );
}
