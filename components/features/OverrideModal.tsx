'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

type OverrideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  specialistName: string;
};

export const OverrideModal = ({ isOpen, onClose, specialistName }: OverrideModalProps) => {
  const [rationale, setRationale] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manual Override: ${specialistName}`}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!rationale}
            onClick={() => {
              alert(`Capacity debt recorded: ${rationale}`);
              onClose();
            }}
          >
            Confirm Override
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500 leading-relaxed">
          You are assigning a task to a specialist who is already at or over 100% capacity.
          This creates <strong>Capacity Debt</strong> and increases the risk of burnout.
        </p>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-slate-400">Justification</label>
          <textarea
            className="p-3 border border-slate-200 rounded-interactive bg-white text-slate-900 h-32 resize-none focus:ring-2 focus:ring-primary outline-none"
            placeholder="Enter the critical reason for this override..."
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
