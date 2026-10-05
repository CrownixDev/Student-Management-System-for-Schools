"use client";

import { Button } from "@/components/shadcn/button";
import { toast } from "react-toastify";

export default function Home() {
  return (
    <div className="flex flex-col flexc min-h-dvh w-full justify-center items-center">
      <h1 className="text-4xl text-emerald-500">Hello Princess</h1>
      <Button onClick={() => toast.success("Oh yearh, It WORKSj")}>Click Me!</Button>
    </div>
  );
}
