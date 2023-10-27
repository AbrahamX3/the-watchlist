import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";

import { SiteFooter } from "~/components/footer";
import NextAuthProvider from "~/components/nextauth-provider";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "Abraham's Watchlist | %s",
    default: "Abraham's Watchlist",
  },
  description: "List of all the show's and movies I've watched",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider session={session}>
            <TRPCReactProvider headers={headers()}>
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
