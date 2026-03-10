export interface CitybusRouteItem {
  co: string;
  route: string;
  orig_en: string;
  orig_tc: string;
  orig_sc: string;
  dest_en: string;
  dest_tc: string;
  dest_sc: string;
  data_timestamp: string;
}

export interface CitybusStopItem {
  stop: string;
  name_tc: string;
  name_en: string;
  name_sc: string;
  lat: number;
  long: number;
  data_timestamp: string;
}

export interface CitybusRouteStopItem {
  co: string;
  route: string;
  dir: "O" | "I";
  seq: number;
  stop: string;
  data_timestamp: string;
}

export interface CitybusETAItem {
  co: string;
  route: string;
  dir: "O" | "I";
  stop: string;
  seq: number;
  dest_tc: string;
  dest_en: string;
  eta_seq: number;
  eta: string | null;
  rmk_tc: string;
  rmk_en: string;
  data_timestamp: string;
}

export interface CitybusRouteListResponse {
  type: string;
  data: CitybusRouteItem[];
}

export interface CitybusStopListResponse {
  type: string;
  data: CitybusStopItem[];
}

export interface CitybusRouteStopListResponse {
  type: string;
  data: CitybusRouteStopItem[];
}

export interface CitybusETAResponse {
  type: string;
  data: CitybusETAItem[];
}

