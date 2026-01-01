import type { Metadata } from "next";
import Footer from "@/components/Footer"; // 後ほど作成/移行
import "./globals.css"; // グローバルスタイルをインポート

export const metadata: Metadata = {
  title: {
    template: "%s | coens-labpicker-25",
    default: "coens-labpicker-25 - 筑波大学 応用理工研究室配属支援",
  },
  description: "筑波大学 理工学群応用理工学類 研究室配属支援システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="antialiased min-h-screen bg-white flex flex-col pt-8">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}