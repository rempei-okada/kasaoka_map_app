'use client';

import { Pin } from '@/types/pin';

interface PinCardProps {
  pin: Pin;
  selected: boolean;
}

// SVG viewBox 0 0 100 130、穴の中心=(50,47)、半径=28 をピクセルに変換
const PIN_W = 80;
const PIN_H = 104;
const HOLE_CX = (50 / 100) * PIN_W;        // 36px
const HOLE_CY = (48 / 130) * PIN_H;        // ≈33.9px
const HOLE_R  = (38 / 100) * PIN_W;        // ≈27.36px

const PLACEHOLDER_IMG = 'https://placehold.co/80x80/9fbdc0/3e3a39?text=';

export function PinCard({ pin, selected }: PinCardProps) {
  const imgSrc = pin.imageUrl || `${PLACEHOLDER_IMG}${encodeURIComponent(pin.title.charAt(0))}`;
  return (
    <div
      style={{
        position: 'relative',
        width: PIN_W,
        height: PIN_H,
        cursor: 'pointer',
        transition: 'transform 0.2s, filter 0.2s',
        transform: selected ? 'scale(1.25) translateY(-8px)' : 'scale(1)',
        filter: selected
          ? 'drop-shadow(0 5px 14px rgba(62,58,57,0.75)) brightness(0.85)'
          : 'drop-shadow(0 3px 9px rgba(62,58,57,0.42))',
      }}
      title={pin.title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/pin.svg" alt={pin.title} width={PIN_W} height={PIN_H} style={{ display: 'block' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt=""
        style={{
          position: 'absolute',
          left: HOLE_CX - HOLE_R,
          top: HOLE_CY - HOLE_R,
          width: HOLE_R * 2,
          height: HOLE_R * 2,
          borderRadius: '50%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

