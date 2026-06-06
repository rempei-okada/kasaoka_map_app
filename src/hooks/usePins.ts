'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Pin, PinRawRow, UsePinsResult } from '@/types/pin';

const CSV_URL =
  process.env.NEXT_PUBLIC_CSV_URL ??
  'https://docs.google.com/spreadsheets/d/1oxEOZJk9IhlgHtlNzU1SETdQVD1Clx9s/export?format=csv';

/**
 * Google スプレッドシートの CSV export URL からピンデータを取得するカスタムフック。
 * NEXT_PUBLIC_CSV_URL が設定されていない場合は既定のスプレッドシートを使用する。
 */
export function usePins(): UsePinsResult {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(CSV_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`CSV の取得に失敗しました (HTTP ${r.status})`);
        return r.text();
      })
      .then((text) => {
        const result = Papa.parse<PinRawRow>(text, {
          header: true,
          skipEmptyLines: true,
        });

        const parsed: Pin[] = result.data
          .map((row): Pin => ({
            id: row.id?.trim() || crypto.randomUUID(),
            lat: parseFloat(row.lat ?? ''),
            lng: parseFloat(row.lng ?? ''),
            title: row.title?.trim() ?? '',
            message: row.message?.trim() ?? '',
            imageUrl: row.imageUrl?.trim() || undefined,
            website: row.website?.trim() || undefined,
            googleMapsUrl: row.googleMapsUrl?.trim() || undefined,
            sponsorName: row.sponsorName?.trim() || undefined,
            sponsorUrl: row.sponsorUrl?.trim() || undefined,
            sponsorMessage: row.sponsorMessage?.trim() || undefined,
          }))
          .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

        if (!cancelled) setPins(parsed);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : '不明なエラー');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { pins, loading, error };
}
