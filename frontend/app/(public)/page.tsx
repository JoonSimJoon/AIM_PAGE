import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                AIM 동아리
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="text-gray-700 hover:text-gray-900">
                소개
              </Link>
              <Link href="/members" className="text-gray-700 hover:text-gray-900">
                부원
              </Link>
              <Link href="/activities" className="text-gray-700 hover:text-gray-900">
                활동
              </Link>
              <Link href="/studies" className="text-gray-700 hover:text-gray-900">
                스터디
              </Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                로그인
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AIM 동아리에 오신 것을 환영합니다
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            인공지능과 머신러닝을 연구하고 학습하는 동아리입니다. 
            함께 성장하고 지식을 공유하며 혁신적인 프로젝트를 만들어갑니다.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/about" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              동아리 알아보기
            </Link>
            <Link href="/studies" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              스터디 보기
            </Link>
          </div>
        </div>

        {/* 특징 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">스터디 활동</h3>
            <p className="text-gray-600">
              정기적인 스터디 모임을 통해 AI/ML 관련 지식을 함께 학습하고 
              개인의 학습 내용을 공유합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">프로젝트</h3>
            <p className="text-gray-600">
              실무 중심의 프로젝트를 통해 이론을 실전에 적용하고 
              포트폴리오를 구축합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">네트워킹</h3>
            <p className="text-gray-600">
              동일한 관심사를 가진 사람들과 네트워크를 형성하고 
              함께 성장할 수 있는 환경을 제공합니다.
            </p>
          </div>
        </div>

        {/* 최근 활동 섹션 */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">최근 활동</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <span className="text-sm text-blue-600 font-medium">스터디</span>
              <h3 className="font-semibold mt-1">딥러닝 기초 스터디</h3>
              <p className="text-gray-600 text-sm mt-2">PyTorch를 이용한 기본적인 신경망 구현</p>
              <span className="text-xs text-gray-500">2024.09.15</span>
            </div>
            <div className="border rounded-lg p-4">
              <span className="text-sm text-green-600 font-medium">프로젝트</span>
              <h3 className="font-semibold mt-1">이미지 분류 프로젝트</h3>
              <p className="text-gray-600 text-sm mt-2">CNN을 이용한 객체 인식 시스템 개발</p>
              <span className="text-xs text-gray-500">2024.09.10</span>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 AIM 동아리. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
