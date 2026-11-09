import { Button } from "@/components/shadcn/button";
import { SidebarFooter } from "@/components/shadcn/sidebar";
import { ThemeToggle } from "../theme-toggle";
import { Separator } from "@/components/shadcn/separator";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Field } from "@/components/shadcn/field";

export default function AppSidebarFooter() {
  return (
    <SidebarFooter>
      <Field orientation="horizontal">
        <Link href={"/"} className="flex-1">
          <Button variant="secondary" className="w-full">
            <HomeIcon />
            Go Home
          </Button>
        </Link>
        <ThemeToggle />
      </Field>
      <Separator />
      <p className="text-xs text-sidebar-foreground/60 text-center">A Project by CROWNIX</p>
    </SidebarFooter>
  );
}
