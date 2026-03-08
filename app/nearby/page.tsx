"use client";

import { CacheLoader } from "@/components/infra/CacheLoader";
import { NearbyETAs } from "@/components/pages/nearby/NearbyETAs";
import { PageLayout } from "@/components/ui/PageLayout";

export default function NearbyPage() {
  return (
    <CacheLoader>
      <PageLayout>
        <NearbyETAs />
      </PageLayout>
    </CacheLoader>
  );
}
