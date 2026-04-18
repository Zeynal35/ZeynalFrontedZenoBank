import type { ReactNode } from 'react';

export function SectionHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs uppercase tracking-[0.35em] text-sky-300/80">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
