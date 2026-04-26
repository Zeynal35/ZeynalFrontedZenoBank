import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity, ChevronLeft, ChevronRight,
  Filter, RotateCcw, Search, ShieldAlert,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { auditLogService } from '@/services/audit-log-service';
import type { AuditLogFilter } from '@/types/audit-log';

const EMPTY_FILTER: AuditLogFilter = {
  page: 1,
  pageSize: 20,
};

function entityTypeColor(type: string): string {
  const map: Record<string, string> = {
    Transaction: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
    Account:     'bg-violet-500/15 text-violet-300 border-violet-500/25',
    Customer:    'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    Loan:        'bg-amber-500/15 text-amber-300 border-amber-500/25',
    Identity:    'bg-rose-500/15 text-rose-300 border-rose-500/25',
  };
  return map[type] ?? 'bg-slate-500/15 text-slate-300 border-slate-500/25';
}

export function AdminAuditLogPage() {
  const [filter, setFilter] = useState<AuditLogFilter>(EMPTY_FILTER);
  const [draft, setDraft]   = useState<Partial<AuditLogFilter>>({});

  const logs = useQuery({
    queryKey: ['audit-logs', filter],
    queryFn:  () => auditLogService.getPaged(filter),
  });

  const entityTypes = useQuery({
    queryKey: ['audit-log-entity-types'],
    queryFn:  auditLogService.getEntityTypes,
  });

  const actions = useQuery({
    queryKey: ['audit-log-actions'],
    queryFn:  auditLogService.getActions,
  });

  const applyFilter = () =>
    setFilter({ ...EMPTY_FILTER, ...draft });

  const resetFilter = () => {
    setDraft({});
    setFilter(EMPTY_FILTER);
  };

  const goPage = (p: number) =>
    setFilter((prev) => ({ ...prev, page: p }));

  const data = logs.data;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin · Compliance"
        title="Audit jurnal"
        description="Bütün servislərdə baş verən əməliyyatların tam qeydi. Filtrlə, axtar, istənilən hadisəni izlə."
      />

      {/* ── Filter panel ── */}
      <Card className="rounded-[28px]">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white">Filtrlər</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Entity Type */}
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Entity növü</span>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50"
              value={draft.entityType ?? ''}
              onChange={(e) => setDraft((p) => ({ ...p, entityType: e.target.value || undefined }))}
            >
              <option value="">Hamısı</option>
              {(entityTypes.data ?? []).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          {/* Status */}
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Status</span>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50"
              value={draft.status ?? ''}
              onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value || undefined }))}
            >
              <option value="">Hamısı</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </label>

          {/* Action */}
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Əməliyyat</span>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50"
              value={draft.action ?? ''}
              onChange={(e) => setDraft((p) => ({ ...p, action: e.target.value || undefined }))}
            >
              <option value="">Hamısı</option>
              {(actions.data ?? []).map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          {/* UserId axtarış */}
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">İstifadəçi ID</span>
            <Input
              placeholder="UUID..."
              value={draft.userId ?? ''}
              onChange={(e) => setDraft((p) => ({ ...p, userId: e.target.value || undefined }))}
            />
          </label>

          {/* From date */}
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Başlanğıc tarix</span>
            <Input
              type="date"
              value={draft.fromDate ?? ''}
              onChange={(e) => setDraft((p) => ({ ...p, fromDate: e.target.value || undefined }))}
            />
          </label>

          {/* To date */}
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Son tarix</span>
            <Input
              type="date"
              value={draft.toDate ?? ''}
              onChange={(e) => setDraft((p) => ({ ...p, toDate: e.target.value || undefined }))}
            />
          </label>
        </div>

        <div className="mt-4 flex gap-3">
          <Button onClick={applyFilter} className="gap-2">
            <Search className="h-4 w-4" />
            Axtar
          </Button>
          <Button variant="secondary" onClick={resetFilter} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </Button>
        </div>
      </Card>

      {/* ── Statistika kartlar ── */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-[22px]">
            <p className="text-xs text-slate-400">Ümumi qeyd</p>
            <p className="mt-1 text-2xl font-bold text-white">{data.totalCount.toLocaleString()}</p>
          </Card>
          <Card className="rounded-[22px]">
            <p className="text-xs text-slate-400">Göstərilən</p>
            <p className="mt-1 text-2xl font-bold text-white">{data.items.length}</p>
          </Card>
          <Card className="rounded-[22px]">
            <p className="text-xs text-slate-400">Uğursuz əməliyyat</p>
            <p className="mt-1 text-2xl font-bold text-rose-400">
              {data.items.filter((i) => i.status === 'Failed').length}
            </p>
          </Card>
        </div>
      )}

      {/* ── Cədvəl ── */}
      <Card className="rounded-[28px] p-0 overflow-hidden">
        {/* Başlıq */}
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Əməliyyat qeydləri</h3>
          </div>
          {logs.isLoading && (
            <span className="text-xs text-slate-500 animate-pulse">Yüklənir...</span>
          )}
        </div>

        {/* Cədvəl başlıqları */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.6fr_80px] gap-4 border-b border-white/8 bg-white/[0.02] px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          <span>Tarix</span>
          <span>Entity</span>
          <span>Əməliyyat</span>
          <span>İstifadəçi</span>
          <span>Açıqlama</span>
          <span>Status</span>
        </div>

        {/* Sətirlər */}
        <div className="divide-y divide-white/[0.05]">
          {logs.isLoading && (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-white/[0.02] mx-6 my-2 rounded-xl" />
            ))
          )}

          {!logs.isLoading && (data?.items ?? []).length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
              <ShieldAlert className="h-8 w-8 text-slate-600" />
              <p className="text-sm">Heç bir qeyd tapılmadı</p>
            </div>
          )}

          {(data?.items ?? []).map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_1.6fr_80px] gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.03] items-start"
            >
              {/* Tarix */}
              <div>
                <p className="text-xs font-medium text-white">
                  {new Date(log.createdAtUtc).toLocaleDateString('az-AZ')}
                </p>
                <p className="text-[11px] text-slate-500">
                  {new Date(log.createdAtUtc).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>

              {/* Entity növü */}
              <div className="flex flex-col gap-1">
                <span className={`inline-flex w-fit items-center rounded-lg border px-2 py-0.5 text-[11px] font-medium ${entityTypeColor(log.entityType)}`}>
                  {log.entityType}
                </span>
                <p className="text-[11px] text-slate-500 truncate max-w-[100px]" title={log.entityId}>
                  #{log.entityId.slice(0, 8)}...
                </p>
              </div>

              {/* Əməliyyat */}
              <p className="text-xs font-medium text-slate-200 break-words">{log.action}</p>

              {/* UserId */}
              <p className="text-[11px] text-slate-500 truncate" title={log.userId ?? ''}>
                {log.userId ? `${log.userId.slice(0, 8)}...` : '—'}
              </p>

              {/* Açıqlama */}
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2" title={log.description}>
                {log.description}
              </p>

              {/* Status */}
              <div>
                <StatusBadge value={log.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/8 px-6 py-4">
            <p className="text-xs text-slate-500">
              {data.totalCount} qeydin {(data.page - 1) * data.pageSize + 1}–{Math.min(data.page * data.pageSize, data.totalCount)}-i göstərilir
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => goPage(data.page - 1)}
                disabled={!data.hasPrev}
                className="gap-1 px-3"
              >
                <ChevronLeft className="h-4 w-4" />
                Əvvəlki
              </Button>

              {/* Səhifə nömrələri */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (data.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (data.page <= 3) {
                    pageNum = i + 1;
                  } else if (data.page >= data.totalPages - 2) {
                    pageNum = data.totalPages - 4 + i;
                  } else {
                    pageNum = data.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goPage(pageNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                        pageNum === data.page
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="secondary"
                onClick={() => goPage(data.page + 1)}
                disabled={!data.hasNext}
                className="gap-1 px-3"
              >
                Növbəti
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}