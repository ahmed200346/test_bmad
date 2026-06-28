import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

export const FeatureCard = ({ icon, title, description, link }: FeatureCardProps) => {
  return (
    <Card className="flex flex-col h-full group hover:border-primary transition-colors">
      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 flex-grow">{description}</p>
      <Button variant="outline" className="w-fit">
        Explore
      </Button>
    </Card>
  );
};
