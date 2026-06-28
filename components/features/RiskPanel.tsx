'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { RiskItem } from './RiskItem';
import { getScheduleRisks, Risk } from '@/app/actions/risks';

export const RiskPanel = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRisks = async () => {
    setLoading(true);
    try {
      const data = await getScheduleRisks();
      setRisks(data);
    } catch (e) {
      console.error("Failed to load risks", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center text-slate-400 italic">
        Scanning for risks...
      </Card>
    );
  }

  return (
    <Card className="w-full h-full border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Active Risks</h3>
          <span className="px-2 py-1 rounded-full bg-critical/10 text-critical text-[10px] font-bold uppercase tracking-wider">
            {risks.filter(r => r.severity === 'critical').length} Critical
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {risks.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm italic">
              No risks detected. Schedule is sustainable.
            </div>
          ) : (
            risks.map(risk => (
              <RiskItem key={risk.id} {...risk} />
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
