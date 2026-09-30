"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { MapReportItem } from "@/components/DashboardMap";

const DashboardMap = dynamic(() => import("@/components/DashboardMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-sibersih-bg flex flex-col items-center justify-center text-sibersih-primary/50 text-xs gap-2">
      <MapPin className="animate-bounce text-sibersih-primary" size={24} />
      <span>Memuat Peta Wilayah...</span>
    </div>
  ),
});

interface DashboardMapClientProps {
  reports?: MapReportItem[];
  actionPathPrefix?: string;
}

export default function DashboardMapClient({ reports, actionPathPrefix }: DashboardMapClientProps) {
  return <DashboardMap reports={reports} actionPathPrefix={actionPathPrefix} />;
}
