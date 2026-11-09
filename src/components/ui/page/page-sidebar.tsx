export function PageSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex h-screen w-[18rem] shrink-0 flex-col overflow-hidden border-r bg-sidebar/50 border-sidebar-border">
      {children}
    </aside>
  );
}

export function PageSidebarHearder({ children }: { children: React.ReactNode }) {
  return <div className="shrink-0">{children}</div>;
}

export function PageSidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>;
}

export function PageSidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="shrink-0">{children}</div>;
}
