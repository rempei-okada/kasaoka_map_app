'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePins } from '@/hooks/usePins';
import { Pin } from '@/types/pin';

function encodePins(pins: Pin[]): string {
  return encodeURIComponent(JSON.stringify(pins));
}

const FIELDS: { key: keyof Pin; label: string; placeholder: string; width: string }[] = [
  { key: 'title',    label: 'タイトル',  placeholder: '笠岡市役所',         width: 'w-28' },
  { key: 'lat',      label: '緯度',      placeholder: '34.5004',           width: 'w-20' },
  { key: 'lng',      label: '経度',      placeholder: '133.5072',          width: 'w-20' },
  { key: 'message',  label: 'メッセージ', placeholder: '説明文を入力…',      width: 'w-36' },
  { key: 'imageUrl', label: '画像URL',   placeholder: 'https://...',       width: 'w-36' },
  { key: 'website',  label: '公式サイト', placeholder: 'https://...',       width: 'w-36' },
];

export default function IframeSamplePage() {
  const { pins: csvPins, loading } = usePins();
  const [rows, setRows] = useState<Pin[]>([]);
  const [iframeSrc, setIframeSrc] = useState('/map');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (csvPins.length > 0 && rows.length === 0) {
      setRows(csvPins);
    }
  }, [csvPins, rows.length]);

  const handleChange = (index: number, field: keyof Pin, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        if (field === 'lat' || field === 'lng') {
          return { ...row, [field]: parseFloat(value) || 0 };
        }
        return { ...row, [field]: value };
      }),
    );
  };

  const handleApply = () => {
    setIframeSrc(`/map?pins=${encodePins(rows)}`);
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), lat: 34.5004, lng: 133.5072, title: '', message: '', imageUrl: '' },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(160deg, #D9E4E6 0%, #E4DED0 55%, #9FD3CD 100%)' }}>
      {/* 上部アクセントライン */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #044550 0%, #4FB3AE 40%, #FFB6B9 70%, #9FD3CD 100%)' }} />

      {/* ヘッダー */}
      <header
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: 'rgba(228,222,208,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #7FBBB2' }}
      >
        <Link href="/" className="transition-colors text-sm font-bold" style={{ color: '#4FB3AE' }}>← もどる</Link>
        <div>
          <h1
            className="text-lg font-black bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #044550, #4FB3AE)' }}
          >
            🌊 iframe 埋め込みサンプル
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#6F94A0' }}>
            <code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>/map</code>{' '}
            を iframe で埋め込んだサンプルページです
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* iframe 埋め込み */}
        <section
          className="backdrop-blur rounded-3xl shadow-lg overflow-hidden"
          style={{ background: 'rgba(217,228,230,0.8)', border: '1px solid #7FBBB2' }}
        >
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid #7FBBB2', background: 'linear-gradient(90deg, rgba(159,211,205,0.28), rgba(79,179,174,0.12))' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: '#FFB6B9' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#9FD3CD' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#4FB3AE' }} />
            <span className="ml-2 text-xs font-mono" style={{ color: '#7FBBB2' }}>🌊 map embed</span>
          </div>
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            width="100%"
            height="480"
            style={{ border: 'none', display: 'block' }}
            title="笠岡周辺マップ"
            loading="lazy"
          />
        </section>

        {/* 埋め込みコード */}
        <section
          className="backdrop-blur rounded-3xl shadow p-6 space-y-3"
          style={{ background: 'rgba(217,228,230,0.8)', border: '1px solid #7FBBB2' }}
        >
          <h2 className="font-black flex items-center gap-2" style={{ color: '#044550' }}>💻 埋め込みコード</h2>
          <p className="text-sm" style={{ color: '#6F94A0' }}>
            以下のコードを任意の HTML に貼り付けることで地図を埋め込めます。
          </p>
          <pre
            className="text-xs rounded-2xl p-4 overflow-x-auto whitespace-pre-wrap break-all"
            style={{ background: 'linear-gradient(135deg, #044550 0%, #4FB3AE 100%)', color: '#D9E4E6' }}
          >
            {`<iframe
  src="https://あなたのドメイン/map"
  width="800"
  height="480"
  style="border:none;"
  title="マップ"
  loading="lazy"
></iframe>`}
          </pre>
        </section>

        {/* CSV カスタマイズ — 編集可能テーブル */}
        <section
          className="backdrop-blur rounded-3xl shadow p-6 space-y-4"
          style={{ background: 'rgba(217,228,230,0.8)', border: '1px solid #7FBBB2' }}
        >
          <h2 className="font-black flex items-center gap-2" style={{ color: '#044550' }}>📌 ピンのカスタマイズ</h2>
          <p className="text-sm" style={{ color: '#6F94A0' }}>
            下のテーブルを編集して{' '}
            <span className="font-bold" style={{ color: '#4FB3AE' }}>「マップに反映」</span>
            {' '}を押すと iframe に反映されます。
            <br />本番環境では{' '}
            <code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>public/pins.csv</code>{' '}
            または Google スプレッドシートの CSV エクスポート URL を使用します。
          </p>

          {loading ? (
            <p className="text-sm animate-pulse" style={{ color: '#4FB3AE' }}>🌊 CSV 読み込み中…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, rgba(159,211,205,0.3), rgba(79,179,174,0.12))' }}>
                    {FIELDS.map((f) => (
                      <th
                        key={f.key}
                        className="px-2 py-2 text-left font-mono whitespace-nowrap"
                        style={{ border: '1px solid #7FBBB2', color: '#044550' }}
                      >
                        {f.label}
                      </th>
                    ))}
                    <th className="px-2 py-2 w-8" style={{ border: '1px solid #7FBBB2' }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id} className="umi-table-row transition-colors">
                      {FIELDS.map((f) => (
                        <td key={f.key} className="px-1 py-1" style={{ border: '1px solid #7FBBB2' }}>
                          <input
                            className={`${f.width} w-full px-1 py-0.5 umi-input`}
                            value={String(row[f.key] ?? '')}
                            placeholder={f.placeholder}
                            onChange={(e) => handleChange(i, f.key, e.target.value)}
                          />
                        </td>
                      ))}
                      <td className="px-1 py-1 text-center" style={{ border: '1px solid #7FBBB2' }}>
                        <button
                          onClick={() => handleDeleteRow(i)}
                          className="umi-delete-btn font-bold leading-none"
                          aria-label="削除"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleAddRow}
              className="umi-btn-outline text-xs font-bold px-4 py-2 rounded-full"
              style={{ border: '2px solid #7FBBB2', color: '#044550' }}
            >
              ＋ ピンを追加
            </button>
            <button
              onClick={handleApply}
              className="text-xs font-bold px-5 py-2 rounded-full text-white shadow hover:shadow-md hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(90deg, #044550, #4FB3AE)' }}
            >
              🗺️ マップに反映
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
