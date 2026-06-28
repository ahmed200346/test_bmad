'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

type OverrideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  specialistName: string;
  onConfirm: (data: { priority: string; rationale: string }) => void;
};

export const OverrideModal = ({ isOpen, onClose, specialistName, onConfirm }: OverrideModalProps) => {
  const [priority, setPriority] = useState('Medium');
  const [rationale, setRationale] = useState('');

  const handleSubmit = () => {
    onConfirm({ priority, rationale });
    setRationale('');
    setPriority('Medium');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Capacity Override: ${specialistName}`}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-slate-500">Cancel</Button>
          <Button
            disabled={!rationale}
            onClick={handleSubmit}
            className="px-6"
          >
            Confirm Override
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="p-4 rounded-interactive bg-critical/10 border border-critical/20 text-critical-dark text-sm leading-relaxed">
          <p className="font-semibold mb-1">Warning: Capacity Debt</p>
          You are assigning a task to a specialist who is already at or over 100% capacity.
          This bypasses sustainable floors and increases the risk of fatigue-induced errors.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-3 border border-slate-200 rounded-interactive bg-white text-slate-900 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Justification Required</label>
            <textarea
              className="p-4 border border-slate-200 rounded-interactive bg-white text-slate-900 h-32 resize-none focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-300"
              placeholder="Describe the critical business need that justifies this over-allocation..."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
