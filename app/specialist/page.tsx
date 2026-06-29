"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { SpecialistStats } from "@/components/features/SpecialistStats";
import { FatigueMonitor } from "@/components/features/FatigueMonitor";
import { SpecialistHourlyLoad } from "@/components/features/SpecialistHourlyLoad";
import { Card } from "@/components/ui/Card";
import { getSpecialistHourlyLoad } from "@/app/actions/capacity";
import { getDevToken } from "@/app/actions/auth";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type HourlyLoadEntry = {
  windowStart: string;
  hours: number;
  taskName: string;
};

function SpecialistPageContent() {
  const searchParams = useSearchParams();
  const targetSpecialistId = parseInt(searchParams.get("id") || "1", 10);

  const [hourlyLoad, setHourlyLoad] = useState<HourlyLoadEntry[]>([]);
  const [isForbidden, setIsForbidden] = useState(false);
  const [fatigueWarning, setFatigueWarning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsForbidden(false);
      try {
        const token = await getDevToken("SPECIALIST");
        const data = await getSpecialistHourlyLoad(token, targetSpecialistId);
        setHourlyLoad(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        if (message.includes("403 Forbidden")) {
          setIsForbidden(true);
        } else {
          console.error("Failed to load load data", e);
        }
      }
    };
    loadData();

    const mockHistoricalLoad = [85, 82];
    if (mockHistoricalLoad.every((load) => load > 80)) {
      setFatigueWarning(true);
    }
  }, [targetSpecialistId]);

  if (isForbidden) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-6">
          <Card className="p-12 text-center max-w-md border-none shadow-lg bg-white">
            <div className="text-5xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              403 Forbidden
            </h1>
            <p className="text-slate-500 mb-6">
              You do not have permission to access this specialist&apos;s detailed
              load view.
            </p>
            <a
              href="/dashboard"
              className="text-primary font-medium hover:underline"
            >
              Return to Dashboard
            </a>
          </Card>
        </main>
      </div>
    );
  }

  const data = {
    name: "Marcus Chen",
    load: 85,
    tasksCount: hourlyLoad.length || 4,
    recoveryWindow: "Friday, 2:00 PM",
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">
        <PageHeader
          title={`Welcome back, ${data.name}`}
          subtitle="Your personal utilization and health monitor."
        />

        <div className="flex flex-col gap-gap">
          {fatigueWarning && (
            <div className="p-4 bg-critical text-white rounded-interactive flex items-center gap-4 animate-bounce shadow-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-bold">Fatigue Warning</h4>
                <p className="text-xs opacity-90">
                  Your burn rate suggests a high probability of fatigue. Please
                  notify your PM to adjust the workload.
                </p>
              </div>
            </div>
          )}
          <SpecialistStats
            specialistName={data.name}
            load={data.load}
            tasksCount={data.tasksCount}
            recoveryWindow={data.recoveryWindow}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gap">
            <div className="md:col-span-2">
              <FatigueMonitor load={data.load} />
              <div className="mt-gap">
                <SpecialistHourlyLoad data={hourlyLoad} />
              </div>
            </div>
            <Card>
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <button className="text-left text-sm text-slate-600 hover:text-primary transition-colors">
                  Request Time Off
                </button>
                <button className="text-left text-sm text-slate-600 hover:text-primary transition-colors">
                  Report Blockage
                </button>
                <button className="text-left text-sm text-slate-600 hover:text-primary transition-colors">
                  Update Availability
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SpecialistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary" />}>
      <SpecialistPageContent />
    </Suspense>
  );
}
