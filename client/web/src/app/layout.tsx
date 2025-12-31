import './globals.css'
import { Inter } from 'next/font/google'
import HeaderWrapper from '@/components/HeaderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FarmQuest - Gamified Farming Platform',
  description: 'AI-Powered Gamified Farming Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderWrapper />
        <main>{children}</main>
      </body>
    </html>
  )
}


