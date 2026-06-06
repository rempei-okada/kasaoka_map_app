'use client';
/// <reference types="google.maps" />

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer, SuperClusterAlgorithm, type Renderer } from '@googlemaps/markerclusterer';
import { Pin } from '@/types/pin';
import { PinCard } from './PinCard';

/** 黄色テーマのクラスターバブル */
const waRenderer: Renderer = {
  render({ count, position }) {
    const el = document.createElement('div');
    el.style.cssText = [
      'display:flex', 'align-items:center', 'justify-content:center',
      'width:48px', 'height:48px', 'border-radius:50%',
      'background:#FFFF00',
      'color:#3e3a39', 'font-size:14px', 'font-weight:700',
      'border:1px solid #3e3a39',
      'box-shadow:0 2px 14px rgba(62,58,57,0.45)',
      'cursor:pointer',
      'transition:transform 0.15s, box-shadow 0.15s',
      'letter-spacing:0.06em',
    ].join(';');
    el.textContent = String(count);
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.13)';
      el.style.boxShadow = '0 4px 20px rgba(62,58,57,0.65)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = '0 2px 14px rgba(62,58,57,0.45)';
    });
    return new google.maps.marker.AdvancedMarkerElement({ position, content: el });
  },
};

interface ClusteredMarkersProps {
  pins: Pin[];
  selectedPin: Pin | null;
  onMarkerClick: (pin: Pin) => void;
}

export function ClusteredMarkers({ pins, selectedPin, onMarkerClick }: ClusteredMarkersProps) {
  const map = useMap();
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markerElementsRef = useRef<globalThis.Map<string, google.maps.marker.AdvancedMarkerElement>>(
    new globalThis.Map(),
  );
  const renderHandleRef = useRef<number | null>(null);

  const scheduleRender = useCallback(() => {
    if (renderHandleRef.current !== null) return;
    renderHandleRef.current = window.requestAnimationFrame(() => {
      renderHandleRef.current = null;
      clustererRef.current?.render();
    });
  }, []);

  useEffect(() => {
    if (!map) return;
    const clusterer = new MarkerClusterer({
      map,
      renderer: waRenderer,
      algorithm: new SuperClusterAlgorithm({
        radius: 160,  // クラスター化する距離（ピクセル）デフォルト60、大きいほど広範囲をまとめる
        maxZoom: 18,  // このズーム以上ではクラスタリングしない
      }),
    });
    clustererRef.current = clusterer;
    // map より先にマーカー ref が登録されていた場合、ここでまとめて投入する
    const existing = Array.from(markerElementsRef.current.values());
    if (existing.length > 0) {
      clusterer.addMarkers(existing);
    }
    return () => {
      clusterer.clearMarkers();
      clustererRef.current = null;
    };
  }, [map]);

  // ref が遅延して順次届くので、addMarker / removeMarker は noDraw で行い、
  // rAF で 1 回だけ render() してまとめてクラスタリングを確定させる。
  const setMarkerRef = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement | null, id: string): void => {
      const prev = markerElementsRef.current.get(id);
      if (marker === prev) return;

      if (marker) {
        markerElementsRef.current.set(id, marker);
        clustererRef.current?.addMarker(marker, true);
      } else if (prev) {
        clustererRef.current?.removeMarker(prev, true);
        markerElementsRef.current.delete(id);
      }
      scheduleRender();
    },
    [scheduleRender],
  );

  useEffect(() => {
    return () => {
      if (renderHandleRef.current !== null) {
        window.cancelAnimationFrame(renderHandleRef.current);
        renderHandleRef.current = null;
      }
    };
  }, []);

  // 各 pin の ref callback を id ごとに memo 化する。
  // インライン関数のままだと selectedPin 変更による再レンダリングのたびに
  // React が ref を「null で呼び直す → 新しい marker で呼ぶ」を全マーカーで実行し、
  // remove → add の間にダイアログ操作中ピンが一瞬消える原因になる。
  const markerRefs = useMemo(() => {
    const map = new globalThis.Map<string, (m: google.maps.marker.AdvancedMarkerElement | null) => void>();
    for (const pin of pins) {
      map.set(pin.id, (m) => setMarkerRef(m, pin.id));
    }
    return map;
  }, [pins, setMarkerRef]);

  return (
    <>
      {pins.map((pin) => (
        <AdvancedMarker
          key={pin.id}
          ref={markerRefs.get(pin.id)}
          position={{ lat: pin.lat, lng: pin.lng }}
          onClick={() => onMarkerClick(pin)}
          title={pin.title}
        >
          <PinCard pin={pin} selected={selectedPin?.id === pin.id} />
        </AdvancedMarker>
      ))}
    </>
  );
}
