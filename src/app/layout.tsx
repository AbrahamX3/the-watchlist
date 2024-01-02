import "~/styles/globals.css";

import { type Metadata } from "next";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { SiteFooter } from "~/components/footer";
import NextAuthProvider from "~/components/nextauth-provider";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: {
    template: "Abraham's Watchlist | %s",
    default: "Abraham's Watchlist",
  },
  description: "List of all the show's and movies I've watched",
  icons: [{ rel: "icon", url: "/icon.webp" }],
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans scrollbar scrollbar-track-muted scrollbar-thumb-foreground scrollbar-w-2 scrollbar-h-2 selection:bg-gray-600 selection:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider session={session}>
            <TRPCReactProvider cookies={cookies().toString()}>
              {children}
              <SiteFooter />
              <TailwindIndicator />
            </TRPCReactProvider>
          </NextAuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
