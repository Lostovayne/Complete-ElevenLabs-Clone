import { cn } from "@/lib/utils";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { HeadphonesIcon, ThumbsUpIcon } from "lucide-react";

export const PageHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b px-4 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant={"outline"} size={"sm"} asChild>
          <Link href={"milto:business@epsaind.com"}>
            <ThumbsUpIcon />
            <span className="hidden lg:block"> Need Help? </span>
          </Link>
        </Button>

        <Button variant={"outline"} size={"sm"} asChild>
          <Link href={"milto:business@epsaind.com"}>
            <HeadphonesIcon />
            <span className="hidden lg:block"> Need Help? </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
