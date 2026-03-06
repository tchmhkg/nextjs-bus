export interface RouteItem {
  co: string;
  route: string;
  bound: "O" | "I";
  service_type: string;
  orig_en: string;
  orig_tc: string;
  dest_en: string;
  dest_tc: string;
}

export interface StopItem {
  stop: string;
  name_tc: string;
  name_en: string;
  lat: number;
  long: number;
}

export interface RouteStopItem {
  co: string;
  route: string;
  bound: "O" | "I";
  service_type: string;
  seq: number;
  stop: string;
}

export interface ETAItem {
  route: string;
  dir: "O" | "I";
  service_type: number;
  seq: number;
  stop: string;
  dest_tc: string;
  dest_en: string;
  eta_seq: number;
  eta: string | null;
  rmk_tc: string;
  rmk_en: string;
}

export interface RouteListResponse {
  type: string;
  data: RouteItem[];
}

export interface StopListResponse {
  type: string;
  data: StopItem[];
}

export interface RouteStopListResponse {
  type: string;
  data: RouteStopItem[];
}

export interface ETAResponse {
  type: string;
  data: ETAItem[];
}
