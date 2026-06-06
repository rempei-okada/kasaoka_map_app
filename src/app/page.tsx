import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex flex-col flex-1 items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #D9E4E6 0%, #E4DED0 55%, #9FD3CD 100%)' }}
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center justify-center py-24 px-8 gap-8">

        {/* 波のデコレーション */}
        <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #044550 0%, #4FB3AE 40%, #FFB6B9 70%, #9FD3CD 100%)' }}
        />

        {/* タイトルカード */}
        <div className="text-center space-y-4">
          <p className="text-6xl">🌊</p>
          <h1
            className="text-4xl font-black bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #044550 0%, #4FB3AE 60%, #7FBBB2 100%)' }}
          >
            笠岡マップ
          </h1>
          <p className="text-sm max-w-sm leading-relaxed" style={{ color: '#6F94A0' }}>
            笠岡の海辺のスポットをピンで巡ろう。<br />
            メッセージや写真を添えられるマップアプリです 🐚
          </p>
        </div>

        {/* ボタン */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            href="/map"
            className="flex-1 inline-flex h-12 items-center justify-center rounded-full px-6 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(90deg, #044550, #4FB3AE)' }}
          >
            🗺️ マップを開く
          </Link>
          <Link
            href="/iframe-sample"
            className="flex-1 inline-flex h-12 items-center justify-center rounded-full px-6 font-bold hover:scale-105 transition-all shadow"
            style={{ background: '#E4DED0', border: '2px solid #7FBBB2', color: '#044550' }}
          >
            🖼️ 埋め込みサンプル
          </Link>
        </div>

        {/* コードブロック */}
        <div
          className="w-full max-w-lg backdrop-blur rounded-2xl shadow p-5 space-y-2"
          style={{ background: 'rgba(217,228,230,0.72)', border: '1px solid #7FBBB2' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#4FB3AE' }}>
            iframe 埋め込みコード
          </p>
          <code
            className="block p-3 rounded-xl text-xs break-all leading-relaxed"
            style={{ background: 'rgba(4,69,80,0.07)', color: '#044550' }}
          >
            {`<iframe src="http://localhost:3000/map" width="800" height="600" style="border:none;"></iframe>`}
          </code>
        </div>

        {/* 波形デコレーション（下部） */}
        <div className="flex gap-1 items-end opacity-30 pointer-events-none" style={{ height: 20 }}>
          {[14, 20, 16, 20, 14, 10, 18, 14, 20, 16].map((h, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: h,
                borderRadius: 2,
                background: '#4FB3AE',
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

