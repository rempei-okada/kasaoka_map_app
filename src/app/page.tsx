'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [iframeWidth, setIframeWidth] = useState(800);
  const [iframeHeight, setIframeHeight] = useState(480);
  const [origin, setOrigin] = useState('https://example.com');
  const [copied, setCopied] = useState(false);
  const [mapState, setMapState] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [stateCopied, setStateCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // iframeからの MAP_STATE メッセージを受信
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'MAP_STATE') {
        setMapState({
          lat: Math.round(e.data.lat * 1000000) / 1000000,
          lng: Math.round(e.data.lng * 1000000) / 1000000,
          zoom: Math.round(e.data.zoom),
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGetMapState = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'GET_MAP_STATE' }, '*');
  };

  const handleCopyState = () => {
    if (!mapState) return;
    const text = `__config__	${mapState.lat}	${mapState.lng}	${mapState.zoom}	`;
    navigator.clipboard.writeText(text).then(() => {
      setStateCopied(true);
      setTimeout(() => setStateCopied(false), 2000);
    });
  };

  const embedCode = `<iframe\n  src="${origin}/map"\n  width="${iframeWidth}"\n  height="${iframeHeight}"\n  style="border:none;"\n  title="\u30de\u30c3\u30d7"\n  loading="lazy"\n></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(160deg, #D9E4E6 0%, #E4DED0 55%, #9FD3CD 100%)' }}>
      {/* アクセントライン */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #044550 0%, #4FB3AE 40%, #FFB6B9 70%, #9FD3CD 100%)' }} />

      {/* ヘッダー */}
      <header
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: 'rgba(228,222,208,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #7FBBB2' }}
      >
        <span className="text-2xl">🌊</span>
        <h1
          className="text-lg font-black bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(90deg, #044550, #4FB3AE)' }}
        >
          笠岡マップ — 埋め込み設定ツール
        </h1>
        <div className="ml-auto">
          <Link
            href="/map"
            className="text-sm font-bold px-4 py-1.5 rounded-full text-white shadow hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(90deg, #044550, #4FB3AE)' }}
          >
            🗺️ マップを直接開く
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── iframe サイズ設定 ── */}
        <section
          className="backdrop-blur rounded-3xl shadow p-6 space-y-4"
          style={{ background: 'rgba(217,228,230,0.8)', border: '1px solid #7FBBB2' }}
        >
          <h2 className="font-black text-lg" style={{ color: '#044550' }}>⚙️ iframe サイズ設定</h2>
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: '#6F94A0' }}>幅 (px)</label>
              <input
                type="number"
                value={iframeWidth}
                min={200}
                onChange={(e) => setIframeWidth(parseInt(e.target.value) || 800)}
                className="w-28 px-2 py-1.5 rounded-lg text-sm"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #7FBBB2', color: '#044550' }}
              />
            </div>
            <span className="pb-2 text-sm" style={{ color: '#7FBBB2' }}>×</span>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: '#6F94A0' }}>高さ (px)</label>
              <input
                type="number"
                value={iframeHeight}
                min={200}
                onChange={(e) => setIframeHeight(parseInt(e.target.value) || 480)}
                className="w-28 px-2 py-1.5 rounded-lg text-sm"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #7FBBB2', color: '#044550' }}
              />
            </div>
          </div>
          <p className="text-xs" style={{ color: '#6F94A0' }}>
            💡 初期表示位置・ズームはスプレッドシートの <code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>__config__</code> 行で設定します（下のガイド参照）
          </p>
        </section>

        {/* ── iframe プレビュー ── */}
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
            <span className="ml-2 text-xs font-mono" style={{ color: '#7FBBB2' }}>
              🌊 preview — {iframeWidth} × {iframeHeight} px
            </span>
          </div>
          <div className="overflow-auto p-4">
            <iframe
              ref={iframeRef}
              src="/map"
              width={iframeWidth}
              height={iframeHeight}
              style={{ border: 'none', display: 'block' }}
              title="マッププレビュー"
              loading="lazy"
            />
          </div>
        </section>

        {/* ── 現在の地図の状態を取得 ── */}
        <section
          className="backdrop-blur rounded-3xl shadow p-6 space-y-4"
          style={{ background: 'rgba(217,228,230,0.8)', border: '1px solid #7FBBB2' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-black" style={{ color: '#044550' }}>📍 現在の地図の位置を取得</h2>
            <button
              onClick={handleGetMapState}
              className="text-sm px-4 py-2 rounded-full font-bold text-white hover:scale-105 transition-all shadow"
              style={{ background: 'linear-gradient(90deg, #044550, #4FB3AE)' }}
            >
              📍 現在の地図から取得
            </button>
          </div>
          <p className="text-xs" style={{ color: '#6F94A0' }}>
            上のプレビューで地図を動かしてから「現在の地図から取得」を押すと、その位置とズームを確認できます。
            スプレッドシートの <code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>__config__</code> 行に貼り付けて初期表示を設定できます。
          </p>

          {mapState ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                {([['緯度 (lat)', mapState.lat], ['経度 (lng)', mapState.lng], ['ズーム (zoom)', mapState.zoom]] as const).map(([label, val]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: '#6F94A0' }}>{label}</span>
                    <span
                      className="px-3 py-2 rounded-xl font-mono font-bold text-center"
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #7FBBB2', color: '#044550' }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold" style={{ color: '#4FB3AE' }}>スプレッドシートへの貼り付け用（タブ区切り）</p>
                <div className="flex gap-2 items-center">
                  <code
                    className="flex-1 text-xs px-3 py-2 rounded-xl break-all"
                    style={{ background: 'rgba(4,69,80,0.07)', color: '#044550' }}
                  >
                    __config__{'\t'}{mapState.lat}{'\t'}{mapState.lng}{'\t'}{mapState.zoom}{'\t'}
                  </code>
                  <button
                    onClick={handleCopyState}
                    className="shrink-0 text-xs px-3 py-2 rounded-full font-bold transition-all"
                    style={{
                      background: stateCopied ? '#4FB3AE' : 'rgba(79,179,174,0.15)',
                      color: stateCopied ? '#fff' : '#044550',
                      border: '1px solid #7FBBB2',
                    }}
                  >
                    {stateCopied ? '✓ コピー済み' : '📋 コピー'}
                  </button>
                </div>
                <p className="text-xs" style={{ color: '#6F94A0' }}>
                  ※ スプレッドシートの該当セルにカーソルを置いて貼り付けると、各列に自動入力されます
                </p>
              </div>
            </div>
          ) : (
            <div
              className="text-sm text-center py-6 rounded-2xl"
              style={{ background: 'rgba(79,179,174,0.06)', border: '1px dashed #7FBBB2', color: '#7FBBB2' }}
            >
              地図を動かして「現在の地図から取得」を押してください
            </div>
          )}
        </section>

        {/* ── 埋め込みコード ── */}
        <section
          className="backdrop-blur rounded-3xl shadow p-6 space-y-3"
          style={{ background: 'rgba(217,228,230,0.8)', border: '1px solid #7FBBB2' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-black" style={{ color: '#044550' }}>💻 埋め込みコード</h2>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-full font-bold transition-all"
              style={{
                background: copied ? '#4FB3AE' : 'rgba(79,179,174,0.15)',
                color: copied ? '#fff' : '#044550',
                border: '1px solid #7FBBB2',
              }}
            >
              {copied ? '✓ コピー済み' : '📋 コピー'}
            </button>
          </div>
          <pre
            className="text-xs rounded-2xl p-4 overflow-x-auto whitespace-pre-wrap break-all"
            style={{ background: 'linear-gradient(135deg, #044550 0%, #4FB3AE 100%)', color: '#D9E4E6' }}
          >
            {embedCode}
          </pre>
        </section>

        {/* ── スプレッドシート設定ガイド ── */}
        <section
          className="backdrop-blur rounded-3xl shadow p-6 space-y-5"
          style={{ background: 'rgba(217,228,230,0.8)', border: '1px solid #7FBBB2' }}
        >
          <h2 className="font-black text-lg" style={{ color: '#044550' }}>📊 スプレッドシートの設定方法</h2>

          {/* Step 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#4FB3AE' }}>
              <StepBadge n={1} /> Google スプレッドシートを作成
            </h3>
            <p className="text-sm pl-8" style={{ color: '#6F94A0' }}>
              Google スプレッドシートを新規作成し、<strong>1 行目</strong>に以下の列ヘッダーを入力します：
            </p>
            <pre className="text-xs rounded-xl p-3 ml-8 overflow-x-auto" style={{ background: 'rgba(4,69,80,0.07)', color: '#044550' }}>
{`id  lat  lng  title  message  imageUrl  website  googleMapsUrl`}
            </pre>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#4FB3AE' }}>
              <StepBadge n={2} /> 各列の説明
            </h3>
            <div className="ml-8 grid sm:grid-cols-2 gap-2 text-xs">
              {([
                ['id', '一意のID（空欄でも自動生成）'],
                ['lat', '緯度（例: 34.5004）'],
                ['lng', '経度（例: 133.5072）'],
                ['title', 'ピンのタイトル'],
                ['message', '説明文'],
                ['imageUrl', '画像 URL（Google Drive も可）'],
                ['website', '公式サイト URL（省略可）'],
                ['googleMapsUrl', 'Google マップ URL（省略可）'],
              ] as const).map(([col, desc]) => (
                <div key={col} className="flex gap-2 items-start">
                  <code className="shrink-0 px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(79,179,174,0.15)', color: '#044550' }}>{col}</code>
                  <span style={{ color: '#6F94A0' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3 — __config__ 行 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#4FB3AE' }}>
              <StepBadge n={3} /> 初期表示位置・ズームを設定する
            </h3>
            <p className="text-sm pl-8" style={{ color: '#6F94A0' }}>
              <code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>id</code> 列に{' '}
              <code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>__config__</code>{' '}
              と入力した行を追加します。この行はピンとして表示されません。
            </p>
            <div className="ml-8 grid sm:grid-cols-3 gap-2 text-xs">
              {([
                ['lat', '初期表示の緯度（例: 34.5004）'],
                ['lng', '初期表示の経度（例: 133.5072）'],
                ['title', 'ズームレベル（例: 13）'],
              ] as const).map(([col, desc]) => (
                <div key={col} className="flex gap-2 items-start">
                  <code className="shrink-0 px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(79,179,174,0.15)', color: '#044550' }}>{col}</code>
                  <span style={{ color: '#6F94A0' }}>{desc}</span>
                </div>
              ))}
            </div>
            <pre className="text-xs rounded-xl p-3 ml-8 overflow-x-auto whitespace-pre" style={{ background: 'rgba(4,69,80,0.07)', color: '#044550' }}>
{`id           lat       lng        title  message
__config__   34.5004   133.5072   13            ← zoom レベル
my-pin-1     34.5010   133.5080   笠岡市役所  説明文…`}
            </pre>
          </div>

          {/* Step 4 — CSV 公開 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#4FB3AE' }}>
              <StepBadge n={4} /> CSV として公開する
            </h3>
            <ol className="text-sm pl-8 space-y-1 list-decimal list-inside" style={{ color: '#6F94A0' }}>
              <li>スプレッドシートの <strong>「ファイル」→「共有」→「ウェブに公開」</strong> を開く</li>
              <li>「リンク」タブで形式を <strong>「カンマ区切りの値（.csv）」</strong> に変更</li>
              <li>「公開」ボタンを押して表示された URL をコピーする</li>
            </ol>
          </div>

          {/* Step 5 — .env.local */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#4FB3AE' }}>
              <StepBadge n={5} /> 環境変数に設定する
            </h3>
            <p className="text-sm pl-8" style={{ color: '#6F94A0' }}>
              プロジェクトルートの{' '}
              <code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>.env.local</code>{' '}
              ファイルに以下を追記します：
            </p>
            <pre className="text-xs rounded-xl p-3 ml-8 overflow-x-auto" style={{ background: 'rgba(4,69,80,0.07)', color: '#044550' }}>
{`NEXT_PUBLIC_CSV_URL=https://docs.google.com/spreadsheets/d/<スプレッドシートのID>/export?format=csv`}
            </pre>
            <p className="text-xs pl-8" style={{ color: '#6F94A0' }}>
              ※ 変更後は開発サーバーを再起動してください（<code style={{ background: 'rgba(79,179,174,0.12)', color: '#044550', padding: '1px 5px', borderRadius: 3 }}>npm run dev</code>）
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
      style={{ background: '#4FB3AE' }}
    >
      {n}
    </span>
  );
}
