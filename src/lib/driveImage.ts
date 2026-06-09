/**
 * Google Drive の共有リンクを <img> で直接表示できる URL に変換する。
 *
 * 対応する入力例:
 *   - https://drive.google.com/file/d/{id}/view?usp=sharing
 *   - https://drive.google.com/open?id={id}
 *   - https://drive.google.com/uc?id={id}&export=download
 *   - https://drive.google.com/uc?export=view&id={id}
 *   - https://docs.google.com/uc?id={id}
 *
 * Google Drive 以外の URL はそのまま返す。
 */
export function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return url;

  const fileId = extractDriveFileId(url);
  if (!fileId) return url;

  // thumbnail エンドポイントは埋め込み表示で最も安定して動作する。
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

/** Google Drive の URL からファイル ID を抽出する。Drive 以外なら null。 */
function extractDriveFileId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname;
  if (host !== 'drive.google.com' && host !== 'docs.google.com') {
    return null;
  }

  // /file/d/{id}/... 形式
  const pathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
  if (pathMatch) return pathMatch[1];

  // ?id={id} クエリ形式（open / uc など）
  const idParam = parsed.searchParams.get('id');
  if (idParam) return idParam;

  return null;
}
