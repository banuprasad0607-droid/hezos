import type { ReactNode } from "react";

export function PageHeader({
  title,
  breadcrumb,
  actions,
}: {
  title: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card shrink-0">
      <div className="flex items-center gap-3 text-sm">
        {breadcrumb && <span className="text-muted-foreground">{breadcrumb}</span>}
        {breadcrumb && <span className="text-muted-foreground">/</span>}
        <span className="font-semibold text-foreground">{title}</span>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
