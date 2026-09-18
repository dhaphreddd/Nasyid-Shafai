import React from 'react';
import { Nasyid } from '../../types/nasyid';
import { NasyidCard } from './NasyidCard';

interface NasyidGridProps {
  items: Nasyid[];
  onDelete: (nasyid: Nasyid) => void;
}

export const NasyidGrid: React.FC<NasyidGridProps> = ({ items, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <NasyidCard key={item.id} nasyid={item} onDelete={onDelete} />
      ))}
    </div>
  );
};
