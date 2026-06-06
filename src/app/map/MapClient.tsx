'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { Pin } from '@/types/pin';
import { usePins } from '@/hooks/usePins';
import { ClusteredMarkers } from './ClusteredMarkers';
import { PinDialog } from './PinDialog';
import { ApiKeyMissing } from './ApiKeyMissing';

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDymVI_NxJtFshb7R1y-15npGAHATGEtlc';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

const DEFAULT_CENTER = { lat: 34.5004, lng: 133.5072 }; // 岡山県笠岡市
const DEFAULT_ZOOM = 13;

function parsePinsFromSearch(search: string): Pin[] | null {
  const params = new URLSearchParams(search);
  const encodedPins = params.get('pins');

  if (!encodedPins) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(encodedPins)) as Pin[];
  } catch {
    return null;
  }
}

export default function MapClient() {
  const { pins: csvPins, loading: csvLoading, error: csvError } = usePins();
  const [searchPins, setSearchPins] = useState<Pin[] | null>(null);
  const [queryReady, setQueryReady] = useState(false);

  useEffect(() => {
    setSearchPins(parsePinsFromSearch(window.location.search));
    setQueryReady(true);
  }, []);

  const pins = useMemo(() => {
    return searchPins ?? csvPins;
  }, [searchPins, csvPins]);

  const loading = !queryReady || (searchPins === null && csvLoading);
  const error = searchPins === null ? csvError : null;
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const handleMarkerClick = useCallback((pin: Pin) => {
    setSelectedPin(pin);
  }, []);

  const handleDialogClose = useCallback(() => {
    setSelectedPin(null);
  }, []);

  if (!MAPS_API_KEY) {
    return <ApiKeyMissing />;
  }

  return (
    <APIProvider apiKey={MAPS_API_KEY}>
      <div className="relative w-full h-full" style={{ background: '#dfd9c5' }}>

        {/* 地図本体（海の色調フィルター適用） */}
        <div className="wa-map-filter absolute inset-0">
          <GoogleMap
            style={{ width: '100%', height: '100%' }}
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            mapId={MAP_ID}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeControl={false}
            streetViewControl={false}
            onZoomChanged={(e) => setZoom(e.detail.zoom)}
          >
            <ClusteredMarkers
              pins={pins}
              selectedPin={selectedPin}
              onMarkerClick={handleMarkerClick}
            />
          </GoogleMap>
        </div>

        {/* 読み込み中オーバーレイ */}
        {loading && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none gap-4"
            style={{ background: 'rgba(223,217,197,0.88)', backdropFilter: 'blur(5px)' }}
          >
            {/* 波形ローディングバー */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 32 }}>
              {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 24,
                    borderRadius: 3,
                    background: '#9fbdc0',
                    animation: `wa-wave 1.1s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
            <span style={{ color: '#6b6560', fontSize: 12, fontWeight: 500, letterSpacing: '0.14em' }}>
              地図を読み込んでいます
            </span>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20"
            style={{
              background: '#3e3a39',
              color: '#dfd9c5',
              fontSize: 12,
              padding: '6px 18px',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(62,58,57,0.3)',
              letterSpacing: '0.06em',
              borderLeft: '3px solid #FFFF00',
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* ピン詳細ダイアログ */}
        <PinDialog pin={selectedPin} onClose={handleDialogClose} />
      </div>
    </APIProvider>
  );
}

