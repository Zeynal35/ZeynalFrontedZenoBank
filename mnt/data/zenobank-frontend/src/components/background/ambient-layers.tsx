export function GlowOrbLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      <div className="absolute left-[5%] top-[10%] h-80 w-80 animate-pulseGlow rounded-full bg-blue-600/15 blur-3xl" />
      <div className="absolute right-[8%] top-[20%] h-96 w-96 animate-float rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-5%] left-[35%] h-[28rem] w-[28rem] animate-drift rounded-full bg-indigo-600/10 blur-3xl" />
    </div>
  );
}

export function GridNoiseOverlay() {
  return <div className="pointer-events-none fixed inset-0 -z-10 bg-premium-grid bg-[size:72px_72px] opacity-[0.12] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />;
}

export function PageAmbientLighting() {
  return (
    <>
      <GlowOrbLayer />
      <GridNoiseOverlay />
    </>
  );
}
