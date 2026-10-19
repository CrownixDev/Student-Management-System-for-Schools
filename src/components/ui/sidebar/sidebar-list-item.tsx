import { cn } from "@/lib/utils";

type SidebarListItemProps = React.ComponentPropsWithoutRef<"button"> & {
  isActive?: boolean;
};

export function SidebarListItem({ isActive = false, className, type = "button", ...props }: SidebarListItemProps) {
  return (
    <button
      type={type}
      data-active={isActive}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[active=true]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarListItemIcon({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground group-data-[active=true]:border-muted-foreground group-data-[active=true]:bg-muted-foreground group-data-[active=true]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarListItemContent({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return <span className={cn("min-w-0 flex-1", className)} {...props} />;
}

export function SidebarListItemTitle({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return <span className={cn("block truncate text-sm font-medium", className)} {...props} />;
}

export function SidebarListItemDescription({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return <span className={cn("block truncate text-xs text-muted-foreground", className)} {...props} />;
}
