import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { loanService } from '@/services/loan-service';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { currency, dateTime } from '@/lib/utils';
import type { Loan } from '@/types/domain';

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({
  loan,
  onClose,
  onApprove,
  onReject,
  isPending,
}: {
  loan: Loan;
  onClose: () => void;
  onApprove: (interestRate: number) => void;
  onReject: (reason: string) => void;
  isPending: boolean;
}) {
  const [interestRate, setInterestRate] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-900/95 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs uppercase tracking-widest text-sky-300/80 mb-1">Loan Review</p>
        <h2 className="text-xl font-semibold text-white mb-4">
          {currency(loan.principalAmount ?? loan.amount, loan.currency)}
        </h2>

        {/* Loan details */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <InfoRow label="Amount" value={currency(loan.principalAmount ?? loan.amount, loan.currency)} />
          <InfoRow label="Term" value={`${loan.termInMonths ?? loan.term} months`} />
          <InfoRow label="Currency" value={loan.currency ?? 'AZN'} />
          <InfoRow label="Status" value={loan.status} />
          <div className="col-span-2">
            <InfoRow label="Purpose" value={loan.purpose} />
          </div>
          <InfoRow label="Applied" value={dateTime(loan.createdAt ?? loan.createdAtUtc)} />
        </div>

        {/* Approve section */}
        <div className="mb-4">
          <label className="block text-sm">
            <span className="mb-2 block text-slate-300">Interest rate (%) — for approval</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="e.g. 12.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </label>
        </div>

        {/* Reject section */}
        <div className="mb-6">
          <label className="block text-sm">
            <span className="mb-2 block text-slate-300">Rejection reason — for reject</span>
            <Input
              placeholder="e.g. Insufficient credit history"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="danger"
            disabled={isPending || !rejectReason.trim()}
            onClick={() => onReject(rejectReason)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            disabled={isPending || !interestRate}
            onClick={() => onApprove(parseFloat(interestRate))}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}

// ─── Admin Loans Page ─────────────────────────────────────────────────────────
export function AdminLoansPage() {
  const [selected, setSelected] = useState<Loan | null>(null);

  const query = useQuery({ queryKey: ['admin-loans'], queryFn: loanService.getAll });

  const approveMutation = useMutation({
    mutationFn: ({ id, interestRate }: { id: string; interestRate: number }) =>
      loanService.approve(id, interestRate),
    onSuccess: () => {
      toast.success('Loan approved successfully');
      setSelected(null);
      query.refetch();
    },
    onError: () => toast.error('Failed to approve loan'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      loanService.reject(id, reason),
    onSuccess: () => {
      toast.success('Loan rejected');
      setSelected(null);
      query.refetch();
    },
    onError: () => toast.error('Failed to reject loan'),
  });

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  const loans = query.data ?? [];
  const pending = loans.filter((l) => l.status === 'Pending');
  const reviewed = loans.filter((l) => l.status !== 'Pending');

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Lending operations"
        title="Loans management"
        description="Approve or reject loan applications with interest rate assignment."
      />

      {/* Pending */}
      <div>
        <h3 className="text-sm uppercase tracking-widest text-amber-300/80 mb-4">
          Pending Review ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <Card className="rounded-[24px] py-10 text-center">
            <p className="text-slate-400 text-sm">No pending loan applications</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pending.map((loan) => (
              <LoanCard key={loan.id} loan={loan} onReview={() => setSelected(loan)} />
            ))}
          </div>
        )}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4">
            Reviewed ({reviewed.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviewed.map((loan) => (
              <LoanCard key={loan.id} loan={loan} onReview={() => setSelected(loan)} />
            ))}
          </div>
        </div>
      )}

      {selected && (
        <ReviewModal
          loan={selected}
          onClose={() => setSelected(null)}
          onApprove={(interestRate) => approveMutation.mutate({ id: selected.id, interestRate })}
          onReject={(reason) => rejectMutation.mutate({ id: selected.id, reason })}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function LoanCard({ loan, onReview }: { loan: Loan; onReview: () => void }) {
  return (
    <Card className="rounded-[24px] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white text-lg">
            {currency(loan.principalAmount ?? loan.amount, loan.currency)}
          </p>
          <p className="text-sm text-slate-400 mt-0.5">{loan.purpose}</p>
        </div>
        <StatusBadge value={loan.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <span>Term: <span className="text-white">{loan.termInMonths ?? loan.term} mo</span></span>
        <span>Currency: <span className="text-white">{loan.currency}</span></span>
        {loan.interestRate != null && (
          <span>Rate: <span className="text-white">{loan.interestRate}%</span></span>
        )}
      </div>
      <Button size="sm" variant="secondary" onClick={onReview} className="w-full">
        {loan.status === 'Pending' ? 'Review Application' : 'View Details'}
      </Button>
    </Card>
  );
}

