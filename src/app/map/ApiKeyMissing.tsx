'use client';

export function ApiKeyMissing() {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ background: 'linear-gradient(160deg, #D9E4E6 0%, #E4DED0 60%, #9FD3CD 100%)' }}
    >
      <div
        style={{
          background: '#E4DED0',
          border: '1px solid #7FBBB2',
          borderTop: '4px solid #4FB3AE',
          borderRadius: 6,
          boxShadow: '0 6px 28px rgba(4,69,80,0.16)',
          padding: '36px 32px',
          maxWidth: 340,
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 32, marginBottom: 12 }}>🗝️</p>
        <p style={{ color: '#044550', fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', marginBottom: 10 }}>
          API キー未設定
        </p>
        <p style={{ fontSize: 12, color: '#6F94A0', lineHeight: 1.9, letterSpacing: '0.03em' }}>
          <code style={{ background: '#D9E4E6', color: '#044550', padding: '1px 5px', borderRadius: 2, fontSize: 11 }}>
            .env.local
          </code>{' '}
          に{' '}
          <code style={{ background: '#D9E4E6', color: '#044550', padding: '1px 5px', borderRadius: 2, fontSize: 11 }}>
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{' '}
          を設定してください。
        </p>
      </div>
    </div>
  );
}

