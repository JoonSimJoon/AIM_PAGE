'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Member {
  id: string
  name: string
  role: string
  profile: {
    displayName: string
    position?: string
    department?: string
    year?: string
    bio?: string
    avatarKey?: string
    links?: any
    isPublic: boolean
  }
}


export default function MembersPage() {
  const [user, setUser] = useState<any>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 제목 설정
    document.title = 'Members - AIM: AI Monsters'
    
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // API에서 멤버 데이터 가져오기
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/members')
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error('멤버 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    alert('로그아웃되었습니다.')
  }

  // 역할별로 멤버 분류
  const president = members.filter(member => 
    member.profile?.position === '회장' || member.role === 'admin'
  )
  const vicePresident = members.filter(member => 
    member.profile?.position === '부회장'
  )
  const executives = members.filter(member => 
    member.profile?.position?.includes('팀장') || 
    ['기획팀장', '개발팀장', '홍보팀장'].includes(member.profile?.position || '')
  )
  const regularMembers = members.filter(member => 
    !president.includes(member) && 
    !vicePresident.includes(member) && 
    !executives.includes(member)
  )

  const MemberCard = ({ member }: { member: Member }) => (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:border-cyan-500 transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        {/* 프로필 이미지 */}
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">
            {(member.profile?.displayName || member.name).charAt(0)}
          </span>
        </div>

        {/* 기본 정보 */}
        <h3 className="text-xl font-bold text-white mb-1">
          {member.profile?.displayName || member.name}
        </h3>
        <p className="text-cyan-400 font-semibold mb-2">
          {member.profile?.position || '부원'}
        </p>

        {/* 세부 정보 */}
        <div className="space-y-1 text-sm text-gray-400 mb-4">
          {member.profile?.department && <p>{member.profile.department}</p>}
          {member.profile?.year && <p>{member.profile.year}</p>}
        </div>

        {/* 소개 */}
        {member.profile?.bio && (
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {member.profile.bio}
          </p>
        )}
        
        {/* 연락처 */}
        <div className="flex space-x-2">
          {member.profile?.links?.github && (
            <a 
              href={`https://github.com/${member.profile.links.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
              </svg>
            </a>
          )}
          {member.profile?.links?.linkedin && (
            <a 
              href={`https://linkedin.com/in/${member.profile.links.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )

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
              <Link href="/members" className="text-cyan-400 font-medium">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AI Monsters
            </span>{' '}
            부원 소개
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AIM 동아리의 멋진 부원들을 소개합니다. 
            각자의 전문성과 열정으로 함께 AI/ML 분야에서 성장하고 있습니다.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">부원 정보를 불러오는 중...</p>
          </div>
        )}

        {/* 데이터가 없을 때 */}
        {!loading && members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">등록된 부원이 없습니다.</p>
          </div>
        )}

        {/* 부원 목록 */}
        {!loading && members.length > 0 && (
          <>

        {/* 회장 */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">회장</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {president.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* 부회장 */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">부회장</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto rounded"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {vicePresident.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* 운영진 */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">운영진</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executives.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* 일반 부원 */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">부원</h2>
            <div className="w-24 h-1 bg-purple-500 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* 가입 안내 */}
        <section className="bg-gradient-to-r from-cyan-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">AI Monsters에 합류하세요!</h2>
          <p className="text-xl mb-6">
            AI와 머신러닝에 관심이 있다면 언제든 환영합니다. 
            함께 학습하고 성장할 수 있는 기회를 놓치지 마세요.
          </p>
          <Link 
            href="/recruit" 
            className="inline-block bg-white text-black font-bold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-white/25 transform hover:-translate-y-1 transition-all duration-300"
          >
            모집 공고 보기
          </Link>
        </section>
        </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-black border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2024 AIM (AI Monsters). All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
