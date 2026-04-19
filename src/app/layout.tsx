import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clear Edge',
  description: 'Competitive intelligence brief from a single domain.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
