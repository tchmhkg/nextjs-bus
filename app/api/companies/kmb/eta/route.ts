import { NextRequest } from "next/server";
import { GET as dynamicGet } from "@/app/api/companies/[company]/eta/route";

export async function GET(request: NextRequest) {
  // Delegate to dynamic route handler with fixed company = "kmb"
  return dynamicGet(request, { params: Promise.resolve({ company: "kmb" }) });
}
