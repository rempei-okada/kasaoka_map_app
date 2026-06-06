'use client';

import { useEffect, useRef } from 'react';
import { Pin } from '@/types/pin';

const PLACEHOLDER_IMG = 'https://placehold.co/480x200/9fbdc0/3e3a39?text=No+Image';

// ── 円形リンクボタン ────────────────────────────────────
function CircleLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white text-[#3e3a39] text-xs font-bold no-underline leading-tight text-center shrink-0"
    >
      {children}
    </a>
  );
}

interface PinDialogProps {
  pin: Pin | null;
  onClose: () => void;
}

export function PinDialog({ pin, onClose }: PinDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (pin) el.showModal(); else el.close();
  }, [pin]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handler = () => onClose();
    el.addEventListener('cancel', handler);
    return () => el.removeEventListener('cancel', handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const googleMapsHref = pin
    ? pin.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`
    : '#';

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="p-0 m-auto w-[min(92vw,380px)] rounded-[14px] border-4 border-[#FFFF00] bg-transparent shadow-[0_16px_48px_rgba(62,58,57,0.28),0_2px_8px_rgba(62,58,57,0.12)]"
    >
      {pin && (
        <div className="flex flex-col overflow-hidden rounded-[11px] bg-white">

          {/* 画像 + スポンサーバッジ */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pin.imageUrl || PLACEHOLDER_IMG}
              alt={pin.title}
              className="block h-45 w-full object-cover"
            />
            {pin.sponsorMessage && (
              <div className="absolute right-2.5 top-2.5 whitespace-nowrap rounded-full bg-[rgba(223,217,197,0.92)] px-3.5 py-1.5 backdrop-blur-sm">
                {pin.sponsorUrl ? (
                  <a
                    href={pin.sponsorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11px] font-medium tracking-wide text-[#3e3a39] no-underline"
                  >
                    {pin.sponsorMessage}
                  </a>
                ) : (
                  <span className="text-[11px] font-medium tracking-wide text-[#3e3a39]">
                    {pin.sponsorMessage}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* タイトル・説明 */}
          <div className="flex flex-col gap-2 bg-white px-4 pb-3 pt-3.5">
            <h2 className="m-0 text-2xl font-bold leading-snug tracking-tight text-[#3e3a39]">
              {pin.title}
            </h2>
            <div className="h-px w-full rounded bg-[#3e3a39]" />
            {pin.message && (
              <p className="m-0 text-[13px] leading-relaxed tracking-wide text-[#6b6560]">
                {pin.message}
              </p>
            )}
          </div>

          {/* ボタン行 */}
          <div className="flex items-center gap-2.5 bg-[#9fbdc0] px-3.5 py-2.5">
            <CircleLink href={googleMapsHref}>地図</CircleLink>
            {pin.website && (
              <CircleLink href={pin.website}>もっと<br />詳しく</CircleLink>
            )}
            <button
              onClick={onClose}
              aria-label="閉じる"
              className="ml-auto flex h-10.5 w-10.5 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-white text-xl font-bold text-[#3e3a39]"
            >
              {'\u2715'}
            </button>
          </div>

        </div>
      )}
    </dialog>
  );
}
