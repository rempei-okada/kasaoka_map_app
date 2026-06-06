import type { Metadata } from 'next';
import MapClient from './MapClient';

export const metadata: Metadata = {
  title: 'マップ',
  description: 'ピン付きインタラクティブマップ',
};

export default function MapPage() {
  return (
    <div className="w-screen h-screen">
      <MapClient />
    </div>
  );
}
