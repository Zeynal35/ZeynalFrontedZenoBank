import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedNeuralBackground } from '@/components/background/animated-neural-background';
import { PageAmbientLighting } from '@/components/background/ambient-layers';

export function UnauthorizedPage() {
  return <CenterCard title="Unauthorized" description="Your session is not authorized for this resource." />;
}

export function ForbiddenPage() {
  return <CenterCard title="Forbidden" description="Your role does not have access to this area of ZenoBank." />;
}

export function NotFoundPage() {
  return <CenterCard title="Not found" description="The page you requested does not exist in this banking workspace." />;
}

function CenterCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <AnimatedNeuralBackground />
      <PageAmbientLighting />
      <Card className="glass-panel-strong relative z-10 max-w-lg rounded-[32px] p-10 text-center">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-slate-400">{description}</p>
        <Button asChild className="mt-6"><Link to="/auth/login">Return to secure entry</Link></Button>
      </Card>
    </div>
  );
}
