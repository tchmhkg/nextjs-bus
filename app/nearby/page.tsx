"use client";

import { CacheLoader } from "@/components/CacheLoader";
import { NearbyETAs } from "@/components/NearbyETAs";
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
