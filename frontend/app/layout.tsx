import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PWAInstaller from './components/PWAInstaller'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lino App',
  description: 'Seu assistente de feedback profissional',
  manifest: '/manifest.json',
  themeColor: '#fbbf24',
  appleWebApp: {
    capable: true,
    title: 'Lino App',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/android-launchericon-192-192.png"
        />
      </head>
      <body className={inter.className}>
  <PWAInstaller />
  {children}
</body>
    </html>
  )
}