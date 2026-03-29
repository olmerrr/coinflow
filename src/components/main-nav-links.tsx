"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  IconDashboard,
  IconHome,
  IconLogin,
  IconRegister,
} from "@/components/nav-icons";

export function navItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  rowClass: (active: boolean) => string;
  iconClass: (active: boolean) => string;
  onNavigate?: () => void;
};

export function MainNavLinks({ rowClass, iconClass, onNavigate }: Props) {
  const pathname = usePathname();
  const { status } = useSession();

  return (
    <>
      <Link
        href="/"
        className={rowClass(navItemActive(pathname, "/"))}
        aria-current={navItemActive(pathname, "/") ? "page" : undefined}
        onClick={onNavigate}
      >
        <IconHome className={iconClass(navItemActive(pathname, "/"))} />
        Home
      </Link>
      {status === "authenticated" ? (
        <Link
          href="/dashboard"
          className={rowClass(navItemActive(pathname, "/dashboard"))}
          aria-current={
            navItemActive(pathname, "/dashboard") ? "page" : undefined
          }
          onClick={onNavigate}
        >
          <IconDashboard
            className={iconClass(navItemActive(pathname, "/dashboard"))}
          />
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            href="/login"
            className={rowClass(navItemActive(pathname, "/login"))}
            aria-current={navItemActive(pathname, "/login") ? "page" : undefined}
            onClick={onNavigate}
          >
            <IconLogin
              className={iconClass(navItemActive(pathname, "/login"))}
            />
            Log in
          </Link>
          <Link
            href="/register"
            className={rowClass(navItemActive(pathname, "/register"))}
            aria-current={
              navItemActive(pathname, "/register") ? "page" : undefined
            }
            onClick={onNavigate}
          >
            <IconRegister
              className={iconClass(navItemActive(pathname, "/register"))}
            />
            Register
          </Link>
        </>
      )}
    </>
  );
}
