"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Navbar() {
  const t = useTranslations("nav");

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 hover:text-amber-600 dark:text-zinc-50 dark:hover:text-amber-500"
        >
          {t("home")}
        </Link>
        <Link
          href="/bookmarks"
          className="text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-500"
        >
          {t("bookmarks")}
        </Link>
      </div>
      <Link
        href="/settings"
        className="rounded px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        {t("settings")}
      </Link>
    </nav>
  );
}
