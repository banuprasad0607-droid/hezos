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
    <header className="min-h-16 py-3.5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-8 bg-card shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
        {breadcrumb && <span className="text-muted-foreground truncate max-w-[150px] sm:max-w-none">{breadcrumb}</span>}
        {breadcrumb && <span className="text-muted-foreground">/</span>}
        <span className="font-semibold text-foreground">{title}</span>
      </div>
      {actions && <div className="flex items-center flex-wrap gap-2 sm:gap-3">{actions}</div>}
    </header>
  );
}
