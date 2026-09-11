import React from 'react';
import PartnerCard from './PartnerCard.jsx';

export default function PartnerList({ partners, selectedPartnerId, onSelectPartner }) {
  if (partners.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm my-4">
        <p className="text-slate-500 font-medium text-sm">No laundry partners found matching your search.</p>
      </div>
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
