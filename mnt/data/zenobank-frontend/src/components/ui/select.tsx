import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SelectOption = { label: string; value: string };

export function Select({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/20">
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="glass-panel-strong z-50 min-w-[200px] rounded-2xl p-2">
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn('relative flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-slate-100 outline-none hover:bg-white/5')}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3">
                  <Check className="h-4 w-4 text-sky-300" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
