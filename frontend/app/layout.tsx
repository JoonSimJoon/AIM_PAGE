import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '동아리 웹사이트',
  description: '동아리 외부 홍보 및 내부 부원 관리/활동 공유',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
