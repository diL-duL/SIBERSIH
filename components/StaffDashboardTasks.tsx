"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight } from "lucide-react";
import StaffTaskCard, { StaffTaskData } from "@/components/StaffTaskCard";

interface StaffDashboardTasksProps {
  tasks: StaffTaskData[];
  newTasksCount?: number;
  className?: string;
}

export default function StaffDashboardTasks({
  tasks,
  newTasksCount = 0,
  className = "",
}: StaffDashboardTasksProps) {
  // Menampilkan hingga 5 tugas terakhir (pada mobile dibatasi maksimal 2 tugas via CSS)
  const displayTasks = tasks.slice(0, 5);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col overflow-hidden ${className}`}>
      {/* HEADER CARD */}
      <div className="p-3.5 sm:p-4 border-b border-sibersih-primary/5 flex justify-between items-center gap-2 bg-gray-50/50 rounded-t-xl shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-sibersih-primary">
            Daftar Tugas Terakhir
          </h2>
          <p className="text-xs text-sibersih-primary/60 mt-0.5">
            Pantau status, detail pengerjaan, dan riwayat tugas
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            {newTasksCount} Tugas Baru
          </span>
        </div>
      </div>

      {/* LIST TUGAS TERAKHIR (MOBILE: 2 TUGAS, DESKTOP: HINGGA 5 TUGAS) */}
      <div className="bg-sibersih-bg/30 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        {displayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-sibersih-primary/40 gap-3 py-10 flex-1">
            <div className="w-14 h-14 rounded-full bg-sibersih-primary/5 flex items-center justify-center">
              <CheckSquare size={28} className="opacity-50 text-green-500" />
            </div>
            <span className="font-semibold text-xs sm:text-sm">
              Belum ada tugas kebersihan saat ini.
            </span>
          </div>
        ) : (
          <>
            {displayTasks.map((task, index) => (
              <div
                key={task.id}
                className={index >= 2 ? "hidden sm:block" : "block"}
              >
                <StaffTaskCard
                  task={task}
                  priorityImage={index === 0}
                  isOpen={expandedId === task.id}
                  onToggle={() => handleToggle(task.id)}
                />
              </div>
            ))}

            {/* TOMBOL LIHAT LAINNYA (KHUSUS MOBILE, DISEMBUNYIKAN DI DESKTOP) */}
            <div className="pt-1 shrink-0 lg:hidden">
              <Link
                href="/staff/history"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sibersih-primary/15 bg-white hover:bg-sibersih-bg text-sibersih-primary text-xs font-semibold shadow-2xs transition-colors"
              >
                <span>Lihat Lainnya</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
