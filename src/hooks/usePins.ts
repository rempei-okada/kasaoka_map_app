'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Pin, MapConfig, PinRawRow, UsePinsResult } from '@/types/pin';
import { normalizeImageUrl } from '@/lib/driveImage';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const CSV_URL_RAW =
  process.env.NEXT_PUBLIC_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/1oxEOZJk9IhlgHtlNzU1SETdQVD1Clx9s/export?format=csv';
const CSV_URL = CSV_URL_RAW.startsWith('/') ? `${BASE_PATH}${CSV_URL_RAW}` : CSV_URL_RAW;

/**
 * Google スプレッドシートの CSV export URL からピンデータを取得するカスタムフック。
 * NEXT_PUBLIC_CSV_URL が設定されていない場合は既定のスプレッドシートを使用する。
 */
export function usePins(): UsePinsResult {
  const [pins, setPins] = useState<Pin[]>([]);
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
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

        // __config__ 行から初期表示設定を抽出
        const configRaw = result.data.find((r) => r.id?.trim() === '__config__');
        const parsedConfig: MapConfig | null = (() => {
          if (!configRaw) return null;
          const lat = parseFloat(configRaw.lat ?? '');
          const lng = parseFloat(configRaw.lng ?? '');
          const zoom = parseInt(configRaw.title ?? '');
          if (isNaN(lat) || isNaN(lng)) return null;
          return { lat, lng, zoom: isNaN(zoom) ? 13 : zoom };
        })();

        const parsed: Pin[] = result.data
          .filter((row) => row.id?.trim() !== '__config__')
          .map((row): Pin => ({
            id: row.id?.trim() || crypto.randomUUID(),
            lat: parseFloat(row.lat ?? ''),
            lng: parseFloat(row.lng ?? ''),
            title: row.title?.trim() ?? '',
            message: row.message?.trim() ?? '',
            imageUrl: normalizeImageUrl(row.imageUrl?.trim() || undefined),
            website: row.website?.trim() || undefined,
            googleMapsUrl: row.googleMapsUrl?.trim() || undefined,
            sponsorName: row.sponsorName?.trim() || undefined,
            sponsorUrl: row.sponsorUrl?.trim() || undefined,
            sponsorMessage: row.sponsorMessage?.trim() || undefined,
          }))
          .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

        if (!cancelled) {
          setPins(parsed);
          setMapConfig(parsedConfig);
        }
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

  return { pins, mapConfig, loading, error };
}
