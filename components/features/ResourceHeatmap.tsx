'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { HeatmapCell } from './HeatmapCell';
import { getHeatmapData } from '@/app/actions/heatmap';

type HeatmapData = {
  specialist: string;
  load: number;
  hours: number;
  capacity: number;
};

export const ResourceHeatmap = () => {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getHeatmapData();
      setData(res);
    } catch (e) {
      console.error("Failed to load heatmap data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-48 flex items-center justify-center text-slate-400 italic">
        Loading capacity data...
      </Card>
    );
  }

  return (
    <Card className="w-full border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gap">
        {data.map((item, i) => (
          <HeatmapCell key={i} {...item} />
        ))}
      </div >
    </Card>
  );
};
