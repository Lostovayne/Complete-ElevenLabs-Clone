import { cn } from "@/lib/utils";
import { SidebarTrigger } from "./ui/sidebar";

export const PageHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex items-center justify-between border-b px-4 py-4", className)}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3"></div>
    </div>
  );
};
