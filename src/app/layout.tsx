import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "PALIRA IMPORTS",
  description: "Loja infantil com produtos encantadores",
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/icon.svg"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.variable} antialiased`}>{children}</body>
    </html>
  )
}
