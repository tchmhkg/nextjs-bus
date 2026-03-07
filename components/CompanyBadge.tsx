"use client";

import { getCompany, type CompanyId } from "@/lib/companies/config";

export function CompanyBadge({ companyId }: { companyId: CompanyId }) {
  const { name, badge } = getCompany(companyId);
  return <span className={badge}>{name}</span>;
}
