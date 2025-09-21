'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      if (!storedUser || !token) {
        router.push('/login')
        return
      }

      const userData = JSON.parse(storedUser)
      if (userData.role !== 'admin') {
        alert('관리자 권한이 필요합니다.')
        router.push('/')
        return
      }

      setUser(userData)
      setLoading(false)
    }

    checkAdminAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-screen bg-black overflow-hidden">
      
      {/* 관리자 네비게이션 */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-gray-800/70 shadow-lg border-b border-gray-700/30 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-white">
                🛠️ <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">AIM</span> 관리자
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link 
                  href="/admin" 
                  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors"
                >
                  대시보드
                </Link>
                <Link 
                  href="/admin/member-management" 
                  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors"
                >
                  멤버 관리
                </Link>
                <Link 
                  href="/admin/activities" 
                  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors"
                >
                  활동 관리
                </Link>
                <Link 
                  href="/admin/studies" 
                  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors"
                >
                  스터디 관리
                </Link>
                <Link 
                  href="/admin/recruit-management" 
                  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors"
                >
                  모집 공고 관리
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-cyan-400 transition-colors"
                target="_blank"
              >
                🌐 사이트 보기
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-white">
                  {user.name}님
                  <span className="ml-1 text-xs bg-pink-600 text-white px-2 py-1 rounded">
                    관리자
                  </span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 사이드바 (모바일에서는 숨김) */}
      <div className="flex pt-16 h-screen">
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow bg-gray-900 border-r border-gray-700 pt-5 pb-4 overflow-y-auto h-full">
              <div className="flex items-center flex-shrink-0 px-4 mb-2">
                <h2 className="text-lg font-medium text-white">관리 메뉴</h2>
              </div>
              <nav className="mt-3 flex-1 px-2 space-y-1">
                <Link
                  href="/admin"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
                >
                  📊 대시보드
                </Link>
                <Link
                  href="/admin/member-management"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
                >
                  👥 멤버 관리
                </Link>
                <Link
                  href="/admin/activities"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
                >
                  🎯 활동 관리
                </Link>
                <Link
                  href="/admin/studies"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
                >
                  📚 스터디 관리
                </Link>
                <Link
                  href="/admin/recruit-management"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
                >
                  📢 모집 공고 관리
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-black h-full">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
