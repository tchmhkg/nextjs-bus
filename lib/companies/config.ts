export type CompanyId = "kmb" | "ctb";

export interface CompanyConfig {
  name: string;
  badge: string;
}

const COMPANIES: Record<CompanyId, CompanyConfig> = {
  kmb: {
    name: "KMB",
    badge:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-1.5 py-0.5 rounded",
  },
  ctb: {
    name: "CTB",
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 text-xs font-medium px-1.5 py-0.5 rounded",
  },
};

export function getCompany(companyId: CompanyId): CompanyConfig {
  return COMPANIES[companyId] ?? COMPANIES.kmb;
}
