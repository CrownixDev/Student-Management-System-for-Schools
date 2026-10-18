export function SetupSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex h-screen w-[18rem] shrink-0 flex-col overflow-hidden border-r border-sidebar-border">
      {children}
    </aside>
  );
}

export function SetupSidebarHearder({ children }: { children: React.ReactNode }) {
  return <div className="shrink-0">{children}</div>;
}

export function SetupSidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>;
}

export function SetupSidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="shrink-0">{children}</div>;
}
