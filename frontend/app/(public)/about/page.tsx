import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/about" className="text-blue-600 font-medium">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">AIM 동아리 소개</h1>
          
          {/* 동아리 개요 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">우리는 누구인가</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              AIM(Artificial Intelligence & Machine Learning) 동아리는 인공지능과 머신러닝 분야에 
              관심있는 학생들이 모여 함께 학습하고 성장하는 커뮤니티입니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              이론적 학습부터 실무 프로젝트까지, 다양한 활동을 통해 AI 분야의 전문가로 성장할 수 있도록 
              서로 돕고 격려하는 환경을 만들어가고 있습니다.
            </p>
          </section>

          {/* 활동 내용 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">주요 활동</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">📚 정기 스터디</h3>
                <p className="text-gray-700 text-sm">
                  매주 정기적으로 AI/ML 관련 주제를 선정하여 스터디를 진행합니다.
                  개별 학습 내용을 발표하고 토론하는 시간을 가집니다.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">🚀 팀 프로젝트</h3>
                <p className="text-gray-700 text-sm">
                  실무에 적용 가능한 AI 프로젝트를 팀 단위로 진행하여 
                  포트폴리오를 구축하고 실무 경험을 쌓습니다.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">🎤 세미나 & 워크샵</h3>
                <p className="text-gray-700 text-sm">
                  외부 전문가 초청 세미나와 최신 기술 트렌드를 공유하는 
                  워크샵을 정기적으로 개최합니다.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">🏆 대회 참가</h3>
                <p className="text-gray-700 text-sm">
                  AI/ML 관련 대회에 팀 단위로 참가하여 실력을 검증하고 
                  수상 경력을 쌓아갑니다.
                </p>
              </div>
            </div>
          </section>

          {/* 동아리 역사 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">동아리 연혁</h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600">2024</div>
                <div>
                  <h4 className="font-medium">AIM 동아리 웹사이트 구축</h4>
                  <p className="text-gray-600 text-sm">부원들의 학습 내용과 프로젝트를 공유할 수 있는 플랫폼 구축</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600">2023</div>
                <div>
                  <h4 className="font-medium">첫 번째 AI 해커톤 개최</h4>
                  <p className="text-gray-600 text-sm">동아리 주관으로 AI 주제의 해커톤을 개최하여 많은 참가자들이 모였습니다</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600">2022</div>
                <div>
                  <h4 className="font-medium">AIM 동아리 설립</h4>
                  <p className="text-gray-600 text-sm">AI와 머신러닝에 관심있는 학생들이 모여 동아리를 설립했습니다</p>
                </div>
              </div>
            </div>
          </section>

          {/* 연락처 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> aim.club@example.com<br />
                <strong>GitHub:</strong> github.com/aim-club<br />
                <strong>Instagram:</strong> @aim_club_official
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
