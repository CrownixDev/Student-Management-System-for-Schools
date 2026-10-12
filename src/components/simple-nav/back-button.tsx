"use client";

import { Button } from "@/components/shadcn/button";
import { ChevronLeft } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";

export default function BackButton({ href }: { href?: Route }) {
  const router = useRouter();

  return (
    <Button
      size={"lg"}
      variant={"outline"}
      className={"flex w-full border-2 cursor-pointer hover:bg-stone-200 text-1xl items-center"}
      onClick={() => (href ? router.push(href) : router.back())}
    >
      <ChevronLeft />
      Go Back
    </Button>
  );
}
