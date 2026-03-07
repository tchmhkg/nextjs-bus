"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const linkBase =
  "text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-500";
const linkActive = "font-semibold text-amber-600 dark:text-amber-500";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const NAV_ITEMS = [
  { href: "/", labelKey: "home" as const },
  { href: "/nearby", labelKey: "nearby" as const },
  { href: "/bookmarks", labelKey: "bookmarks" as const },
] as const;

const SETTINGS_ITEM = { href: "/settings", labelKey: "settings" as const };

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors ${"className" in item ? item.className : ""} ${
              isActivePath(pathname, item.href) ? linkActive : linkBase
            }`}
          >
            {t(item.labelKey)}
          </Link>
        ))}
      </div>
      <Link
        href={SETTINGS_ITEM.href}
        className={`rounded px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
          isActivePath(pathname, SETTINGS_ITEM.href) ? linkActive : linkBase
        }`}
      >
        {t(SETTINGS_ITEM.labelKey)}
      </Link>
    </nav>
  );
}
