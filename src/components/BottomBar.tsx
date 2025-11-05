"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

const items = [
  { href: "/dashboard", label: "Home" },
  { href: "/goals", label: "Metas" },
  { href: "/transactions", label: "Transações" },
  { href: "/challenges", label: "Desafios" },
  { href: "/profile", label: "Perfil" },
];

export function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-14 flex items-center justify-around z-50 md:max-w-md md:mx-auto md:rounded-t-2xl">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center text-xs",
              active ? "text-[#7A44FF] font-medium" : "text-slate-500"
            )}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
