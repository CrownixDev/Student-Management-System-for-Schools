import { FaceSlightlySmilingIcon } from "lucide-react";

export default function PageLoading() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col text-muted-foreground items-center justify-center gap-2">
        <FaceSlightlySmilingIcon className="animate-spin" />
        <p className="text-lg">Loading</p>
      </div>
    </div>
  );
}
