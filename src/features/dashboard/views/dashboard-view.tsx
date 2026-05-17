import { PageHeader } from "@/components/page-header";
import { HeroPattern } from "@/features/dashboard/components/hero-pattern";

export function DashboardView() {
  return (
    <div className="relative h-100 w-full bg-slate-50">
      <PageHeader title="Dashboard" className="lg:hidden" />
      <HeroPattern />

      <div className="relative space-y-8 p-4 lg:p-16"></div>
    </div>
  );
}
