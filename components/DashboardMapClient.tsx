"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const DashboardMap = dynamic(() => import('@/components/DashboardMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-sibersih-bg flex flex-col items-center justify-center text-sibersih-primary/50 text-xs gap-2">
            <MapPin className="animate-bounce text-sibersih-primary" size={24} />
            <span>Memuat Peta Wilayah...</span>
        </div>
    )
});

export default function DashboardMapClient() {
    return <DashboardMap />;
}
