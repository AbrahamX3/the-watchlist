"use client";

import { usePathname, useRouter } from "next/navigation";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}): React.ReactNode {
  const router = useRouter();
  const path = usePathname();

  if (!session && path === "/dashboard") {
    router.push("/api/auth/signin");

    return null;
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
