import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageLoader } from "@/components/ui/PageLoader";
import { headers } from "next/headers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "AudioTechServices | Professional Audio Engineering & System Integration",
  description:
    "Professional audio engineering, amplifiers, DSP processing, cinema sound systems, speaker systems, installation and maintenance.",
  metadataBase: new URL("https://audiotechservices.com"),
  openGraph: {
    title: "AudioTechServices | Professional Audio Engineering & System Integration",
    description:
      "Professional audio engineering, amplifiers, DSP processing, cinema sound systems, speaker systems, installation and maintenance.",
    url: "https://audiotechservices.com",
    siteName: "AudioTechServices",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AudioTechServices | Professional Audio Engineering",
    description:
      "Professional audio engineering, amplifiers, DSP processing, cinema sound systems.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }) {
  // Check if current path is under /admin — if yes, skip site chrome
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {isAdmin ? (
          // Admin: NO header, footer, cursor, scroll effects
          <main className="flex-1">{children}</main>
        ) : (
          // Main site: full chrome
          <>
            <PageLoader />
            <SmoothScroll>
              <CustomCursor />
              <ScrollProgress />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <BackToTop />
            </SmoothScroll>
          </>
        )}
      </body>
    </html>
  );
}
