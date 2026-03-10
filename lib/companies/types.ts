export type BusCompanyId = "kmb" | "ctb";

export interface BusCompany {
  id: BusCompanyId;
  baseUrl: string;
  getRouteList: () => Promise<unknown[]>;
  getStopList: () => Promise<unknown[]>;
  getRouteStopList: () => Promise<unknown[]>;
  getETA: (stopId: string, route: string, serviceType: string) => Promise<unknown[]>;
}
