import { WavyBackground } from "@/components/ui/wavy-background";

export function HeroPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      <WavyBackground
        colors={["#2DD4BF", "#22D3EE", "#38BDF8", "#818CF8"]}
        speed="slow"
        blur={3}
        backgroundFill="hsl(0 0% 100%)"
        waveOpacity={0.1}
        waveWidth={60}
        waveyoffset={250}
        containerClassName="h-full"
      />
    </div>
  );
}
