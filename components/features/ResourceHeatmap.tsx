'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { HeatmapCell } from './HeatmapCell';

type HeatmapData = {
  specialist: string;
  load: number; // 0 to 100+
};

const MOCK_DATA: HeatmapData[] = [
  { specialist: "Marcus (Senior Dev)", load: 75 },
  { specialist: "Sarah (Architect)", load: 90 },
  { specialist: "Elena (Frontend)", load: 110 },
  { specialist: "James (DevOps)", load: 40 },
  { specialist: "Maya (Product)", load: 65 },
  { specialist: "Kael (Backend)", load: 120 },
];

export const ResourceHeatmap = () => {
  return (
    <Card className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {MOCK_DATA.map((item, i) => (
          <HeatmapCell key={i} specialist={item.specialist} load={item.load} />
        ))}
      </div >
    </Card>
  );
};
