import { LoaderIcon } from "lucide-react";

export default function PageLoading() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col text-muted-foreground items-center justify-center gap-2">
        <LoaderIcon className="animate-spin" />
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
