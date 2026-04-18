import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { customerService } from '@/services/customer-service';
import { useAuthStore } from '@/store/auth-store';

const options = ['NationalId', 'Passport', 'UtilityBill', 'Selfie'].map((value) => ({ label: value, value }));

export function KycUploadPage() {
  const [documentType, setDocumentType] = useState('NationalId');
  const [file, setFile] = useState<File | null>(null);
  const setKycDocuments = useAuthStore((state) => state.setKycDocuments);
  const navigate = window.location;

  const query = useQuery({ queryKey: ['my-kyc'], queryFn: customerService.getMyKyc });
  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('documentType', documentType);
      return customerService.uploadKyc(formData);
    },
    onSuccess: async () => {
      const docs = await customerService.getMyKyc();
      setKycDocuments(docs);
      navigate.href = '/app/dashboard';
    },
  });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Compliance" title="Submit KYC documents" description="Upload identity evidence to activate full banking functionality. Review state is tracked in real time and reflected across dashboard capabilities." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="glass-panel-strong rounded-[32px] p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Document type</label>
              <Select value={documentType} onValueChange={setDocumentType} placeholder="Select document type" options={options} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">File upload</label>
              <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-sky-400/25 bg-white/[0.03] text-center transition hover:bg-white/[0.05]">
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                <span className="text-lg font-medium text-white">Drop file or click to upload</span>
                <span className="mt-2 text-sm text-slate-400">PDF, PNG, JPG accepted</span>
                {file ? <span className="mt-4 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-200">{file.name}</span> : null}
              </label>
            </div>
            <Button size="lg" onClick={() => mutation.mutate()} disabled={!file || mutation.isPending}>Submit KYC</Button>
          </div>
        </Card>
        <Card className="rounded-[32px]">
          <h3 className="text-lg font-semibold text-white">Verification tracker</h3>
          <div className="mt-4 space-y-3">
            {(query.data ?? []).map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{doc.documentType}</p>
                    <p className="text-sm text-slate-400">{doc.fileName}</p>
                  </div>
                  <StatusBadge value={doc.status} />
                </div>
              </div>
            ))}
            {!query.data?.length ? <p className="text-sm text-slate-400">No KYC documents uploaded yet.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
