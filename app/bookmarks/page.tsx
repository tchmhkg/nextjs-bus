"use client";

import { BookmarkList } from "@/components/BookmarkList";
import { CacheLoader } from "@/components/CacheLoader";
import { PageLayout } from "@/components/ui/PageLayout";

export default function BookmarksPage() {

  return (
    <CacheLoader>
      <PageLayout>
        <BookmarkList />
      </PageLayout>
    </CacheLoader>
  );
}
