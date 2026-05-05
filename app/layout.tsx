import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Forma AI Claim · Todd Wu',
  description: 'Case study — Forma AI Claim',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
