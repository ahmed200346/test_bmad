'use client';

import React, { useEffect } from 'react';
import { Button } from './Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-container w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-primary p-4 text-white font-medium">
          {title}
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
        {!footer && (
          <div className="p-4 border-t border-slate-200 flex justify-end">
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        )}
      </div>
    </div>
  );
};