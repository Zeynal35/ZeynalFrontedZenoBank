import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="flex min-h-[220px] flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
        <Sparkles className="h-8 w-8 text-sky-300" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
    </Card>
  );
}
