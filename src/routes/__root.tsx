// Root layout — installs all global providers and shell pieces.
// Music continues across pages because the audio element lives here.
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppProvider } from "@/state/AppContext";
import { MusicProvider } from "@/state/MusicContext";
import { HUD } from "@/components/shell/HUD";
// Music button sekarang di-render di dalam HUD, jadi tidak perlu di sini.
import { ComfortOverlay } from "@/components/shell/ComfortOverlay";
import { FloatingPets } from "@/components/shell/FloatingPets";
import { ToastStack } from "@/components/shell/ToastStack";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-card rounded-3xl p-10">
        <div className="text-6xl mb-4">🌷</div>
        <h1 className="font-display text-3xl font-bold">Halaman ini lagi sembunyi</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Yuk balik ke tempat yang nyaman.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground soft-shadow"
          >
            Balik ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Keysha is Queen— istirahat sebentar disini yuk 🤍" },
      { name: "description", content: "pada akhirnya, semua akan terlewati, seperti hujan, sederas apapun jatuhnya, ia tidak pernah abadi, akan ada jeda, akan ada reda, dan langit akan kembali cerah" },
      { name: "author", content: "U deserve to happy" },
      { property: "og:title", content: "Keysha is Queen— istirahat sebentar disini yuk 🤍" },
      { property: "og:description", content: "pada akhirnya, semua akan terlewati, seperti hujan, sederas apapun jatuhnya, ia tidak pernah abadi, akan ada jeda, akan ada reda, dan langit akan kembali cerah" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      // Preconnect to Google Fonts for the display font
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { name: "twitter:title", content: "Keysha is Queen— istirahat sebentar disini yuk 🤍" },
      { name: "twitter:description", content: "pada akhirnya, semua akan terlewati, seperti hujan, sederas apapun jatuhnya, ia tidak pernah abadi, akan ada jeda, akan ada reda, dan langit akan kembali cerah" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3faf7fb6-8791-48f0-b745-32f2f4064c32/id-preview-7cf1eac2--a024d037-f7e9-4583-bb94-3ebf5b49c0a4.lovable.app-1777183951504.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3faf7fb6-8791-48f0-b745-32f2f4064c32/id-preview-7cf1eac2--a024d037-f7e9-4583-bb94-3ebf5b49c0a4.lovable.app-1777183951504.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppProvider>
      <MusicProvider>
        <div className="min-h-dvh flex flex-col">
          <HUD />
          <main key="page" className="flex-1 animate-page-in pb-32">
            <Outlet />
          </main>
          {/* Pet companion yang berjalan di bawah layar */}
          <FloatingPets />
          {/* Toast notifikasi (heart points dapet, dsb) */}
          <ToastStack />
          {/* Overlay "Aku butuh ditemenin" — animasi pelukan */}
          <ComfortOverlay />
        </div>
      </MusicProvider>
    </AppProvider>
  );
}
