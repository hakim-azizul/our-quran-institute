'use client';

import React from 'react';
import MosqueHero from '../MosqueHero';

export default function Spread0_Hero({
  onNext,
  onOpenBooking,
  onWatchVideo,
  side = 'both',
  isWriting = true
}) {
  return (
    <MosqueHero
      onOpenBooking={onOpenBooking}
      onExplorePrograms={onNext}
      onScrollDown={onNext}
    />
  );
}
