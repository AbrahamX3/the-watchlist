"use client";

import Link from "next/link";
import { Film, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { ModeToggle } from "~/components/toggle-theme";
import { Button } from "~/components/ui/button";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Film className="h-6 w-6" />
            <span className="flex items-center gap-2 align-middle font-bold">
              <span className="hidden sm:inline-block">Abraham&apos;s</span>
              <span className="hidden sm:inline-block">Watchlist</span>
              <span> Dashboard</span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-x-2">
            <ModeToggle />
            <Button variant="outline" size="icon" onClick={() => signOut()}>
              <span className="sr-only">Sign out</span>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
