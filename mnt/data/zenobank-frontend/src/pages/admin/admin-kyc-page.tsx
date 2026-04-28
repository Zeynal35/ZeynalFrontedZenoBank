import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Eye, CheckCircle, XCircle, X, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { customerService, type KycDocument } from '@/services/customer-service';
import { api } from '@/lib/axios';

// ─── Blob URL hook — faylı token ilə yükləyir ────────────────────────────────
function useKycFileUrl(docId: string) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    setLoading(true);
    setError(false);
    setBlobUrl(null);

    api
      .get(`/api/customers/kyc/${docId}/file`, { responseType: 'blob' })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setBlobUrl(objectUrl);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [docId]);

  return { blobUrl, loading, error };
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({
  doc,
  onClose,
  onApprove,
  onReject,
  isPending,
}: {
  doc: KycDocument;
  onClose: () => void;
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
  isPending: boolean;
}) {
  const [note, setNote] = useState('');

  const { blobUrl, loading, error } = useKycFileUrl(doc.id);

  const isImage =
    doc.originalFileName?.match(/\.(jpg|jpeg|png)$/i) ||
    doc.filePath?.match(/\.(jpg|jpeg|png)$/i);

  const isPdf =
    doc.originalFileName?.match(/\.pdf$/i) ||
    doc.filePath?.match(/\.pdf$/i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-900/95 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-widest text-sky-300/80">KYC Review</p>
            <h2 className="mt-1 text-xl font-semibold text-white">{doc.documentType}</h2>
            <p className="text-sm text-slate-400">Doc №: {doc.documentNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge value={doc.status} />
            <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* File preview */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden min-h-[300px] flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-slate-400 p-8">
                <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
                <p className="text-sm">Loading document...</p>
              </div>
            ) : error || !blobUrl ? (
              <div className="flex flex-col items-center gap-3 text-slate-400 p-8">
                <FileText className="h-12 w-12" />
                <p className="text-sm text-red-400">Could not load file preview</p>
                <p className="text-xs text-slate-500">{doc.originalFileName || 'Document file'}</p>
              </div>
            ) : isImage ? (
              <img
                src={blobUrl}
                alt="KYC Document"
                className="max-w-full max-h-[400px] object-contain rounded-xl"
              />
            ) : isPdf ? (
              <iframe
                src={blobUrl}
                className="w-full h-[400px] rounded-xl"
                title="KYC Document PDF"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400 p-8">
                <FileText className="h-12 w-12" />
                <p className="text-sm">{doc.originalFileName || 'Document file'}</p>
                <a
                  href={blobUrl}
                  download={doc.originalFileName}
                  className="text-sky-400 hover:text-sky-300 text-sm underline"
                >
                  Download file
                </a>
              </div>
            )}
          </div>

          {/* Doc info */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <InfoRow label="Document type" value={doc.documentType} />
            <InfoRow label="Document number" value={doc.documentNumber} />
            <InfoRow label="Submitted" value={new Date(doc.createdAtUtc).toLocaleString()} />
            <InfoRow label="Status" value={doc.status} />
            {doc.reviewerNote && (
              <div className="col-span-2">
                <InfoRow label="Reviewer note" value={doc.reviewerNote} />
              </div>
            )}
          </div>

          {/* Only show actions if Pending */}
          {doc.status === 'Pending' && (
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-2 block text-slate-300">
                  Reviewer note <span className="text-slate-500">(optional for approve, required for reject)</span>
                </span>
                <Input
                  placeholder="e.g. Document verified successfully"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="danger"
                  size="lg"
                  disabled={isPending || !note.trim()}
                  onClick={() => onReject(note)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="lg"
                  disabled={isPending}
                  onClick={() => onApprove(note || 'Approved by admin')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          )}
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

// ─── Admin KYC Page ───────────────────────────────────────────────────────────
export function AdminKycPage() {
  const [selected, setSelected] = useState<KycDocument | null>(null);

  const query = useQuery({
    queryKey: ['admin-kyc'],
    queryFn: customerService.getAllKyc,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      customerService.approveKyc(id, note),
    onSuccess: () => {
      toast.success('KYC approved successfully');
      setSelected(null);
      query.refetch();
    },
    onError: () => toast.error('Failed to approve KYC'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      customerService.rejectKyc(id, note),
    onSuccess: () => {
      toast.success('KYC rejected');
      setSelected(null);
      query.refetch();
    },
    onError: () => toast.error('Failed to reject KYC'),
  });

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  const docs = query.data ?? [];
  const pending = docs.filter((d) => d.status === 'Pending');
  const reviewed = docs.filter((d) => d.status !== 'Pending');

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="KYC Queue"
        title="KYC Management"
        description="Review, approve or reject customer identity verification documents."
      />

      {/* Pending */}
      <div>
        <h3 className="text-sm uppercase tracking-widest text-amber-300/80 mb-4">
          Pending Review ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <Card className="rounded-[24px] py-10 text-center">
            <p className="text-slate-400 text-sm">No pending KYC documents</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pending.map((doc) => (
              <KycCard key={doc.id} doc={doc} onReview={() => setSelected(doc)} />
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
            {reviewed.map((doc) => (
              <KycCard key={doc.id} doc={doc} onReview={() => setSelected(doc)} />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selected && (
        <ReviewModal
          doc={selected}
          onClose={() => setSelected(null)}
          onApprove={(note) => approveMutation.mutate({ id: selected.id, note })}
          onReject={(note) => rejectMutation.mutate({ id: selected.id, note })}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function KycCard({ doc, onReview }: { doc: KycDocument; onReview: () => void }) {
  return (
    <Card className="rounded-[24px] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white">{doc.documentType}</p>
          <p className="text-sm text-slate-400 mt-0.5">№ {doc.documentNumber}</p>
        </div>
        <StatusBadge value={doc.status} />
      </div>

      <div className="text-xs text-slate-500">
        Submitted: {new Date(doc.createdAtUtc).toLocaleString()}
      </div>

      {doc.reviewerNote && (
        <p className="text-xs text-amber-300 border border-amber-400/20 bg-amber-500/5 rounded-xl px-3 py-2">
          Note: {doc.reviewerNote}
        </p>
      )}

      <Button size="sm" variant="secondary" onClick={onReview} className="w-full">
        <Eye className="mr-2 h-3.5 w-3.5" />
        {doc.status === 'Pending' ? 'Review Document' : 'View Details'}
      </Button>
    </Card>
  );
}

