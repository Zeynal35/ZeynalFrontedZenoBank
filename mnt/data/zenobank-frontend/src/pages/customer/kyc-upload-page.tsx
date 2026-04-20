import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { customerService } from '@/services/customer-service';
import { useAuthStore } from '@/store/auth-store';

// ✅ Backend enum: NationalId=1, Passport=2, UtilityBill=3, Selfie=4
const DOCUMENT_TYPE_MAP: Record<string, number> = {
  NationalId: 1,
  Passport: 2,
  UtilityBill: 3,
  Selfie: 4,
};

const options = Object.keys(DOCUMENT_TYPE_MAP).map((value) => ({ label: value, value }));

export function KycUploadPage() {
  const navigate = useNavigate();
  const { customerProfile, setKycDocuments } = useAuthStore();

  const [documentType, setDocumentType] = useState('NationalId');
  const [documentNumber, setDocumentNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const query = useQuery({
    queryKey: ['my-kyc'],
    queryFn: customerService.getMyKyc,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Please select a file');
      if (!documentNumber.trim()) throw new Error('Please enter document number');
      if (!customerProfile?.id) throw new Error('Customer profile not found');

      const formData = new FormData();
      // ✅ Backend tələb etdiyi 4 field hamısı göndərilir
      formData.append('CustomerProfileId', customerProfile.id);
      formData.append('DocumentType', String(DOCUMENT_TYPE_MAP[documentType]));
      formData.append('DocumentNumber', documentNumber.trim());
      formData.append('File', file);

      return customerService.uploadKyc(formData);
    },
    onSuccess: async () => {
      toast.success('KYC document submitted! Admin will review it shortly.');
      try {
        const docs = await customerService.getMyKyc();
        setKycDocuments(docs);
      } catch { /* ignore */ }
      await query.refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    },
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Compliance"
        title="Submit KYC documents"
        description="Upload identity evidence to activate full banking functionality. Review state is tracked in real time and reflected across dashboard capabilities."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="glass-panel-strong rounded-[32px] p-8">
          <div className="space-y-5">

            {/* Document type */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">Document type</label>
              <Select
                value={documentType}
                onValueChange={setDocumentType}
                placeholder="Select document type"
                options={options}
              />
            </div>

            {/* ✅ Document number — backend tələb edir */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">Document number</label>
              <Input
                placeholder="e.g. AA1234567"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>

            {/* File upload */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">File upload</label>
              <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-sky-400/25 bg-white/[0.03] text-center transition hover:bg-white/[0.05]">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <span className="text-lg font-medium text-white">Drop file or click to upload</span>
                <span className="mt-2 text-sm text-slate-400">PDF, PNG, JPG accepted</span>
                {file && (
                  <span className="mt-4 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-200">
                    {file.name}
                  </span>
                )}
              </label>
            </div>

            <Button
              size="lg"
              onClick={() => mutation.mutate()}
              disabled={!file || !documentNumber.trim() || mutation.isPending}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit KYC'}
            </Button>
          </div>
        </Card>

        {/* Verification tracker */}
        <Card className="rounded-[32px]">
          <h3 className="text-lg font-semibold text-white">Verification tracker</h3>
          <div className="mt-4 space-y-3">
            {(query.data ?? []).map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{doc.documentType}</p>
                    <p className="text-sm text-slate-400">{doc.documentNumber}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(doc.createdAtUtc).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge value={doc.status} />
                </div>
                {doc.reviewerNote && (
                  <p className="mt-2 text-xs text-amber-300">Note: {doc.reviewerNote}</p>
                )}
              </div>
            ))}
            {!query.data?.length && (
              <p className="text-sm text-slate-400">No KYC documents uploaded yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

