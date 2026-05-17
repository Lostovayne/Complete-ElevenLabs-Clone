"use client";

import { useUser } from "@clerk/nextjs";

export function DashboardHeader() {
  const { isLoaded, user } = useUser();
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Nice to see you</p>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">
          {isLoaded ? (user?.fullName ?? user?.firstName ?? "there") : "..."}
        </h1>
      </div>
    </div>
  );
}
