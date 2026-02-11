import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { FABProvider } from "@/contexts/fab-context"
import { SkipLinks } from "@/components/primitives/SkipLinks"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  title: "GoodFlip Care",
  description: "Your Companion for Comprehensive Healthcare",
  generator: 'v0.dev',
  icons: {
    icon: '/images/goodflip-care-logo.png',
    shortcut: '/images/goodflip-care-logo.png',
    apple: '/images/goodflip-care-logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className={`${manrope.variable} font-manrope antialiased`}>
        <SkipLinks 
          mainContentId="main-content"
          navigationId="main-navigation"
        />
        <FABProvider>
          {children}
        </FABProvider>
      </body>
    </html>
  )
}