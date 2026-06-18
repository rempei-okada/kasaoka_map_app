/** CSV の 1 行に対応するピンデータ */
export interface Pin {
  /** 一意の識別子 */
  id: string;
  /** 緯度 */
  lat: number;
  /** 経度 */
  lng: number;
  /** ピンに表示するタイトル */
  title: string;
  /** ダイアログに表示するメッセージ */
  message: string;
  /** サムネイル・ダイアログ画像の URL（省略可） */
  imageUrl?: string;
  /** 公式 Web サイト URL（省略可） */
  website?: string;
  /** Google マップ URL（省略可。空の場合は lat/lng から自動生成） */
  googleMapsUrl?: string;
  /** 応援スポンサー名（省略可） */
  sponsorName?: string;
  /** 応援スポンサーの URL（省略可） */
  sponsorUrl?: string;
  /** 応援スポンサーのバナーメッセージ（省略可） */
  sponsorMessage?: string;
}

/** CSV raw 行（全フィールドが文字列） */
export interface PinRawRow {
  id?: string;
  lat?: string;
  lng?: string;
  title?: string;
  message?: string;
  imageUrl?: string;
  website?: string;
  googleMapsUrl?: string;
  sponsorName?: string;
  sponsorUrl?: string;
  sponsorMessage?: string;
}

/** スプレッドシートの __config__ 行から読み取るマップ初期表示設定 */
export interface MapConfig {
  lat: number;
  lng: number;
  zoom: number;
}

/** usePins フックが返す値 */
export interface UsePinsResult {
  pins: Pin[];
  mapConfig: MapConfig | null;
  loading: boolean;
  error: string | null;
}
