"use client";

import { BookmarkList } from "@/components/pages/bookmarks/BookmarkList";
import { CacheLoader } from "@/components/infra/CacheLoader";
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
