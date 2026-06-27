import React from 'react';
import { Card } from '../ui/Card';
import { RiskItem } from './RiskItem';

const MOCK_RISKS = [
  { id: 1, type: 'Slippage', title: 'API Integration', severity: 'critical', desc: 'Prerequisite delayed by 3 days.' },
  { id: 2, type: 'Constraint', title: 'Marcus (Senior Dev)', severity: 'warning', desc: 'Load exceeds 100% in Window 2.' },
  { id: 3, type: 'Slippage', title: 'Auth Layer', severity: 'warning', desc: 'Potential bottleneck in review stage.' },
];

export const RiskPanel = () => {
  return (
    <Card className="w-full h-full">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Risk Panel</h3>
        <div className="flex flex-col gap-3">
          {MOCK_RISKS.map(risk => (
            <RiskItem key={risk.id} {...risk} />
          ))}
        </div>
      </div>
    </Card>
  );
};
