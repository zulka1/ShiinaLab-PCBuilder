import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShiinaLab — PC Builder & Parts Store",
  description: "Rencanakan rakitan PC dan jelajahi katalog komponen demonstrasi ShiinaLab.",
  keywords: ["PC builder", "komponen PC", "rakit PC", "ShiinaLab"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var o=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(typeof n==='string'&&(n.indexOf('bis_')===0||n.indexOf('__processed_')===0)){return}return o.apply(this,arguments)}}catch(e){}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
        {children}
      </body>
    </html>
  );
}
