import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";

import { Footer, Header, RouteGuard } from "@/components";
import CursorSpotlight from "@/components/CursorSpotlight";
import LuminousBackground from "@/components/LuminousBackground";
import { ThemeCustomizerProvider } from "@/contexts/ThemeCustomizerContext";
import { ThemeCustomizerButton } from "@/components/theme-customizer/ThemeCustomizerButton";
import { ThemeCustomizerPanel } from "@/components/theme-customizer/ThemeCustomizerPanel";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { baseURL, style } from "@/app/resources";

import { Source_Serif_4 } from "next/font/google";
import { Source_Code_Pro } from "next/font/google";

import { person, home } from "@/app/resources/content";
import {
  Column,
  Flex,
  ToastProvider,
} from "@/once-ui/components";

export async function generateMetadata() {
  return {
    metadataBase: new URL(`https://${baseURL}`),

    title: home.title,

    description: home.description,

    openGraph: {
      title: `${person.firstName}'s Portfolio`,
      description: "Portfolio website showcasing my work.",
      url: baseURL,
      siteName: `${person.firstName}'s Portfolio`,
      locale: "en_US",
      type: "website",
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/*
  Site-wide typeface: Source Serif 4 — the closest freely-licensed web
  alternative to Apple's "New York" serif (which is a proprietary system
  font not distributed for general web embedding). Used for both body
  copy and headings so the whole site reads as one consistent serif voice,
  the same way New York is used across Apple's own UI.
*/
const primary = Source_Serif_4({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type FontConfig = {
  variable: string;
};

const secondary: FontConfig | undefined = Source_Serif_4({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});
const tertiary: FontConfig | undefined = undefined;
/*
 */

const code = Source_Code_Pro({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <Flex
      as="html"
      lang="en"
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-theme={style.theme}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(
        primary.variable,
        secondary ? secondary.variable : "",
        tertiary ? tertiary.variable : "",
        code.variable
      )}
      style={{
        width: "100%",
      }}
    >
      <ToastProvider>
        <ThemeCustomizerProvider>
        <Column
          as="body"
          fillWidth
          margin="0"
          padding="0"
          style={{
            minHeight: "100vh",
            width: "100%",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LoadingScreen />
          <LuminousBackground />
          <CursorSpotlight />
          <ThemeCustomizerButton />
          <ThemeCustomizerPanel />

          {/* Top spacing */}
          <Flex fillWidth minHeight="16" />

          {/* Header/Navbar */}
          <Header />

          {/* Main Content Wrapper */}
          <Flex
            fillWidth
            flex={1}
            horizontal="center"
            position="relative"
            zIndex={2}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <main
              style={{
                width: "100%",
                maxWidth: "1600px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "24px",
                paddingRight: "24px",
              }}
            >
              <RouteGuard>{children}</RouteGuard>
            </main>
          </Flex>

          {/* Footer */}
          <Footer />
        </Column>
        </ThemeCustomizerProvider>
      </ToastProvider>
    </Flex>
  );
}