"use client";

import { useTranslations } from "next-intl";
import { CacheLoader } from "@/components/CacheLoader";
import { NearbyETAs } from "@/components/NearbyETAs";
import { PageLayout } from "@/components/ui/PageLayout";

export default function NearbyPage() {
  const t = useTranslations("nearby");
  return (
    <CacheLoader>
      <PageLayout>
        <NearbyETAs />
      </PageLayout>
    </CacheLoader>
  );
}
