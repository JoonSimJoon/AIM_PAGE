import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIM: AI Monsters',
  description: 'AIM (AI Monsters) - 국민대학교 AI와 머신러닝 동아리. 함께 코딩하고, 학습하며, 세상을 바꿀 AI 프로젝트를 만들어갑니다.',
  icons: {
    icon: [
      { url: '/images/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/images/favicons/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/images/favicons/favicon.ico',
    apple: '/images/favicons/favicon-96x96.png'
  },
  openGraph: {
    title: 'AIM: AI Monsters',
    description: 'AIM (AI Monsters) - 국민대학교 AI와 머신러닝 동아리',
    type: 'website',
    locale: 'ko_KR'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
