"use client";

import { useTranslations } from "next-intl";
import { BookmarkList } from "@/components/BookmarkList";
import { CacheLoader } from "@/components/CacheLoader";

export default function BookmarksPage() {
  const t = useTranslations("bookmarks");

  return (
    <CacheLoader>
      <main className="mx-auto max-w-md px-4 py-6">
        <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h1>
        <BookmarkList />
      </main>
    </CacheLoader>
  );
}
