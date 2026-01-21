import './globals.css'
import { Inter, JetBrains_Mono } from 'next/font/google'
import HeaderWrapper from '@/components/HeaderWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
})

export const metadata = {
  title: 'FarmQuest Nexus - Cyber-Agri Gaming Platform',
  description: 'High-fidelity gaming aesthetic for AI-Powered Gamified Sustainable Farming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark text-gray-100`}>
        <HeaderWrapper />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}


