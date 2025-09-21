'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 페이지 제목 설정
    document.title = 'AIM: AI Monsters - 국민대학교 AI 동아리'
    
    // 로그인 상태 확인
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    alert('로그아웃되었습니다.')
  }
  return (
    <div className="min-h-screen bg-black">
      {/* 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-black border-b border-gray-800 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <img 
                  src="/images/aim_logo.png" 
                  alt="AIM 로고" 
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xl font-bold text-white">AIM</span>
                <span className="text-sm text-gray-400 ml-1">AI Monsters</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">
                소개
              </Link>
              <Link href="/members" className="text-gray-300 hover:text-cyan-400 transition-colors">
                부원
              </Link>
              <Link href="/activities" className="text-gray-300 hover:text-cyan-400 transition-colors">
                활동
              </Link>
              <Link href="/studies" className="text-gray-300 hover:text-cyan-400 transition-colors">
                스터디
              </Link>
              <Link href="/recruit" className="text-gray-300 hover:text-cyan-400 transition-colors">
                모집
              </Link>
              {user ? (
                <div className="flex items-center space-x-3">
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="bg-pink-600 text-white px-3 py-2 rounded-md hover:bg-pink-700 text-sm"
                    >
                      🛠️ 관리자
                    </Link>
                  )}
                  <span className="text-white">
                    안녕하세요, {user.name}님
                    {user.role === 'admin' && (
                      <span className="ml-1 text-xs bg-pink-600 text-white px-2 py-1 rounded">
                        관리자
                      </span>
                    )}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 border border-gray-600"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link href="/login" className="bg-cyan-500 text-black px-4 py-2 rounded-md hover:bg-cyan-400 font-semibold">
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main>
        {/* 히어로 섹션 */}
        <section className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* 히어로 로고 */}
            <div className="mb-8">
              <img 
                src="/images/logo_hero.png" 
                alt="AIM 동아리 로고" 
                className="mx-auto h-32 md:h-48 lg:h-64 object-contain"
              />
            </div>
            
            {/* 메인 타이틀 */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                AIM
              </span>
            </h1>
            
            {/* 서브 타이틀 */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-300 mb-4">
              AI Monsters
            </h2>
            
            {/* 설명 */}
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              국민대학교 AI와 머신러닝의 괴물들이 모인 곳.<br />
              함께 코딩하고, 학습하며, 세상을 바꿀 AI 프로젝트를 만들어갑니다.
            </p>
            
            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link 
                href="/about" 
                className="bg-cyan-500 text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                동아리 알아보기
              </Link>
              <Link 
                href="/members" 
                className="border-2 border-pink-500 text-pink-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-500 hover:text-black hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                부원 소개
              </Link>
            </div>
          </div>
        </section>

        {/* 소개 섹션 */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 섹션 타이틀 */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Become an AI Monster?
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                AI 괴물이 되어 함께 성장하고 배울 수 있는 최고의 환경을 제공합니다
              </p>
            </div>

            {/* 특징 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-cyan-500">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Study</h3>
                <p className="text-gray-400 leading-relaxed">정기적인 스터디 모임을 통해 AI/ML 관련 최신 기술을 함께 학습하고 지식을 공유합니다.</p>
              </div>
              
              <div className="group hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-pink-500">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Project</h3>
                <p className="text-gray-400 leading-relaxed">실무 중심의 프로젝트를 통해 이론을 실전에 적용하고 포트폴리오를 구축합니다.</p>
              </div>
              
              <div className="group hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Networking</h3>
                <p className="text-gray-400 leading-relaxed">동일한 관심사를 가진 사람들과 네트워크를 형성하고 함께 성장할 수 있는 환경을 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-20 bg-gradient-to-br from-cyan-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              AI Monster가 되어보세요
            </h2>
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
              AI와 머신러닝의 괴물이 되어 여러분의 무한한 가능성을 발견하고<br />
              함께하는 Monster들과 세상을 바꿔보세요
            </p>
                   <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <Link
                       href="/recruit"
                       className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-white/25 transform hover:-translate-y-1 transition-all duration-300"
                     >
                       모집 공고 보기
                     </Link>
                     <Link
                       href="/about"
                       className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
                     >
                       동아리 알아보기
                     </Link>
                   </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2024 AIM (AI Monsters). All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
