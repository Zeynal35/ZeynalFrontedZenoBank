import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function Modal({ open, onOpenChange, title, children }: PropsWithChildren<{ open: boolean; onOpenChange: (open: boolean) => void; title: string }>) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm" />
        <DialogPrimitive.Content className="glass-panel-strong fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold text-white">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-xl p-2 hover:bg-white/5">
              <X className="h-4 w-4 text-slate-300" />
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
