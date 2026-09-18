import React from 'react';
import PartnerCard from './PartnerCard';
import type { Partner } from '@quickwash/shared';
import { Card } from '@/components/ui/card';

export interface PartnerListProps {
  partners: Partner[];
  selectedPartnerId: string;
  onSelectPartner: (partner: Partner) => void;
}

export default function PartnerList({ partners, selectedPartnerId, onSelectPartner }: PartnerListProps) {
  if (partners.length === 0) {
    return (
      <Card className="p-8 text-center my-4">
        <p className="text-slate-500 font-medium text-sm">No laundry partners found matching your search.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          isSelected={partner.id === selectedPartnerId}
          onSelect={onSelectPartner}
        />
      ))}
    </div>
  );
}
