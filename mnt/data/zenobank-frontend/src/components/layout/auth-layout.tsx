import { Outlet } from 'react-router-dom';
import { AnimatedNeuralBackground } from '@/components/background/animated-neural-background';
import { PageAmbientLighting } from '@/components/background/ambient-layers';
import { ZenoBankLogo } from '@/components/layout/logo';

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedNeuralBackground />
      <PageAmbientLighting />
      <div className="page-shell relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between py-6">
          <ZenoBankLogo />
          <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-sky-200">Secure access</span>
        </header>
        <main className="grid flex-1 items-center py-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <section className="mb-10 max-w-2xl lg:mb-0">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-sky-300/80">Institutional-grade digital banking</p>
            <h1 className="gradient-text text-5xl font-semibold leading-tight">Operate accounts, compliance, approvals, and money movement with premium clarity.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">
              ZenoBank unifies onboarding, KYC, multi-account operations, transfers, loans, and compliance workflows inside a refined, secure, enterprise-grade interface.
            </p>
          </section>
          <div className="flex justify-center lg:justify-end">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
