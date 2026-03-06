"use client";

import { useTranslations } from "next-intl";
import { BookmarkList } from "@/components/BookmarkList";
import { CacheLoader } from "@/components/CacheLoader";
import { PageLayout } from "@/components/ui/PageLayout";

export default function BookmarksPage() {
  const t = useTranslations("bookmarks");

  return (
    <CacheLoader>
      <PageLayout title={t("title")}>
        <BookmarkList />
      </PageLayout>
    </CacheLoader>
  );
}
