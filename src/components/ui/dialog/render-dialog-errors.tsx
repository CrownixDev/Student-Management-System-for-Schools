import { DotIcon } from "lucide-react";

export default function RenderDialogErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="p-2 rounded-sm bg-destructive/10 border border-destructive/30">
      {errors.length === 1 &&
        errors.map((err) => (
          <p key={err} role="alert" className="flex items-center text-sm text-destructive ">
            {err}
          </p>
        ))}
      {errors.length > 1 &&
        errors.map((err) => (
          <p key={err} role="alert" className="flex items-center text-sm text-destructive ">
            <DotIcon />
            {err}
          </p>
        ))}
    </div>
  );
}
