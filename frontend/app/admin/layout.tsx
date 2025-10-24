'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { authGet } from '@/lib/api-client'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isAdmin, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = async () => {
      if (isLoading) return // 로딩 중이면 대기

      if (!isAuthenticated) {
        console.log('인증되지 않은 사용자입니다.')
        router.push('/login')
        return
      }

      if (!isAdmin) {
        alert('관리자 권한이 필요합니다.')
        router.push('/')
        return
      }

      // 토큰 유효성 검증을 위해 간단한 API 호출
      try {
        const response = await authGet('/api/members/admin/all')
        if (response.status === 401) {
          console.log('토큰이 만료되었거나 유효하지 않습니다.')
          logout()
          router.push('/login')
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error)
        logout()
        router.push('/login')
      }
    }

    checkAdminAuth()
  }, [isAuthenticated, isAdmin, isLoading, router, logout])

  const handleLogout = () => {
    if (confirm('로그아웃하시겠습니까?')) {
      logout()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
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
                  {user?.name}님
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
                  href="/admin/about-management"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
                >
                  ℹ️ 소개 관리
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
