'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// UI Components
import { Button, Card, Badge, Text, Title, Subtitle, Loading, FAQ } from '@/components/ui'

// Navigation Link Component
const NavLink: React.FC<{ href: string; active?: boolean; children: React.ReactNode }> = ({ 
  href, 
  active = false, 
  children 
}) => {
  const linkClasses = active 
    ? 'text-cyan-400 font-medium' 
    : 'text-gray-300 hover:text-cyan-400 transition-colors'
    
  return (
    <Link href={href} className={linkClasses}>
      {children}
    </Link>
  )
}

interface RecruitNotice {
  id: string
  title: string
  bodyMd: string
  startAt: string
  endAt: string
  isOpen: boolean
  externalFormUrl?: string
  targetAudience?: string
  recruitCount?: string
  recruitMethod?: string
  shortDescription?: string
}

export default function RecruitPage() {
  const [user, setUser] = useState<any>(null)
  const [recruitNotice, setRecruitNotice] = useState<RecruitNotice | null>(null)
  const [loading, setLoading] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [showPastRecruits, setShowPastRecruits] = useState(false)
  const [pastRecruits, setPastRecruits] = useState<RecruitNotice[]>([])
  const [loadingPast, setLoadingPast] = useState(false)

  // FAQ 데이터
  const faqData = [
    {
      question: "프로그래밍을 전혀 모르는데 지원할 수 있나요?",
      answer: "네! 열정과 의지만 있다면 충분합니다. 기초부터 차근차근 알려드리며, 멘토링 시스템을 통해 단계별로 학습할 수 있도록 도와드립니다."
    },
    {
      question: "다른 동아리와 중복 가입이 가능한가요?",
      answer: "가능하지만, AIM 활동에 적극적으로 참여할 수 있는지 고려해주세요. 정기 모임과 프로젝트 활동에 충분한 시간을 투자할 수 있어야 합니다."
    },
    {
      question: "학과 제한이 있나요?",
      answer: "없습니다! 모든 학과 학생을 환영합니다. 오히려 다양한 전공 배경의 학생들이 모여 더 창의적인 아이디어와 프로젝트가 나올 수 있습니다."
    },
    {
      question: "활동비가 있나요?",
      answer: "기본 활동비는 없으며, 필요시 동아리에서 지원합니다. 대회 참가비, 교육 자료비 등은 동아리 예산으로 지원됩니다."
    },
    {
      question: "면접은 어떤 식으로 진행되나요?",
      answer: "개별 면접으로 20분 내외 진행됩니다. 지원 동기, 관심 분야, 활동 계획 등에 대해 편안한 대화 형식으로 이루어집니다. 기술적 지식보다는 열정과 참여 의지를 중점적으로 봅니다."
    },
    {
      question: "모집 후 바로 프로젝트에 참여할 수 있나요?",
      answer: "신입 부원들을 위한 기초 교육 과정(약 1개월)을 거친 후 프로젝트에 참여하게 됩니다. 개인의 수준에 맞는 프로젝트를 배정하여 부담 없이 시작할 수 있습니다."
    }
  ]

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const fetchPastRecruits = async () => {
    setLoadingPast(true)
    try {
      const response = await fetch('/api/content/recruit/past')
      if (response.ok) {
        const data = await response.json()
        setPastRecruits(data)
      }
    } catch (error) {
      console.error('지난 모집 공고 조회 실패:', error)
    } finally {
      setLoadingPast(false)
    }
  }

  const handleShowPastRecruits = () => {
    if (!showPastRecruits && pastRecruits.length === 0) {
      fetchPastRecruits()
    }
    setShowPastRecruits(!showPastRecruits)
  }

  useEffect(() => {
    // 페이지 제목 설정
    document.title = 'Recruit - AIM: AI Monsters'
    
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // 활성 모집 공고 조회
    fetchActiveRecruitNotice()
  }, [])

  const fetchActiveRecruitNotice = async () => {
    try {
      const response = await fetch('/api/content/recruit/active')
      if (response.ok) {
        const data = await response.json()
        setRecruitNotice(data)
      }
    } catch (error) {
      console.error('모집 공고 조회 오류:', error)
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
              <NavLink href="/about">소개</NavLink>
              <NavLink href="/members">부원</NavLink>
              <NavLink href="/activities">활동</NavLink>
              <NavLink href="/studies">스터디</NavLink>
              <NavLink href="/recruit" active>모집</NavLink>
              {user ? (
                <div className="flex items-center space-x-3">
                  {user.role === 'admin' && (
                    <Button 
                      as={Link}
                      href="/admin"
                      variant="secondary"
                      size="sm"
                    >
                      🛠️ 관리자
                    </Button>
                  )}
                  <span className="text-white">
                    안녕하세요, {user.name}님
                    {user.role === 'admin' && (
                      <Badge variant="admin" size="sm" className="ml-1">
                        관리자
                      </Badge>
                    )}
                  </span>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost"
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button as={Link} href="/login" variant="primary">
                  로그인
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="min-h-[50vh]">
            <Loading text="모집 공고를 불러오는 중..." size="lg" />
          </div>
        ) : recruitNotice ? (
          <>
            {/* 헤더 섹션 */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  AIM
                </span>{' '}
                {recruitNotice.title}
              </h1>
              <div className="flex justify-center items-center space-x-4 mb-6">
                <Badge 
                  variant={recruitNotice.isOpen && new Date(recruitNotice.endAt) > new Date() ? 'success' : 'warning'}
                  size="lg"
                >
                  {recruitNotice.isOpen && new Date(recruitNotice.endAt) > new Date() ? '🔥 모집중' : '📝 모집마감'}
                </Badge>
              </div>
              <Text variant="secondary" size="lg" className="mb-4">
                모집 기간: {new Date(recruitNotice.startAt).toLocaleDateString()} ~ {new Date(recruitNotice.endAt).toLocaleDateString()}
              </Text>
            </div>

            {/* 히어로 배너 섹션 */}
            <div className="relative mb-16">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10"></div>
                <div className="relative p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* 왼쪽: 주요 정보 */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                          recruitNotice.isOpen && new Date(recruitNotice.endAt) > new Date() 
                            ? 'aim-badge-success animate-pulse' 
                            : 'aim-badge-warning'
                        }`}>
                          {recruitNotice.isOpen && new Date(recruitNotice.endAt) > new Date() ? '🔥 모집중' : '📝 모집마감'}
                        </div>
                        <span className="aim-text-secondary text-sm">
                          {new Date(recruitNotice.endAt).toLocaleDateString()}까지
                        </span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold aim-text-primary mb-4">
                        {recruitNotice.title}
                      </h2>
                      
                      <p className="text-xl aim-text-secondary mb-6 leading-relaxed">
                        {recruitNotice.shortDescription || (
                          <>
                            <span className="aim-icon-pink">AI Monsters</span>와 함께 인공지능의 세계로 빠져보세요! 
                            경험과 전공에 상관없이 <span className="aim-icon-cyan">열정</span>만 있다면 누구나 환영합니다.
                          </>
                        )}
                      </p>
                      
                      {recruitNotice.externalFormUrl && (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <a
                            href={recruitNotice.externalFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-pink-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                          >
                            🚀 지금 지원하기
                          </a>
                          <a
                            href="/about"
                            className="border-2 border-gray-600 aim-text-primary px-8 py-4 rounded-xl font-bold text-lg hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 text-center"
                          >
                            동아리 더 알아보기
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* 오른쪽: 핵심 정보 카드 */}
                    <div className="space-y-4">
                      <Card variant="dark" padding="md" className="backdrop-blur">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">📅</span>
                          </div>
                          <div>
                            <Text as="h3" weight="semibold" variant="primary">모집 기간</Text>
                            <Text variant="secondary" size="sm">
                              {new Date(recruitNotice.startAt).toLocaleDateString()} ~ {new Date(recruitNotice.endAt).toLocaleDateString()}
                            </Text>
                          </div>
                        </div>
                      </Card>
                      
                      <Card variant="dark" padding="md" className="backdrop-blur">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">🎯</span>
                          </div>
                          <div>
                            <Text as="h3" weight="semibold" variant="primary">모집 대상</Text>
                            <Text variant="secondary" size="sm">
                              {recruitNotice.targetAudience || "국민대학교 재학생 (전 학과/학년)"}
                            </Text>
                          </div>
                        </div>
                      </Card>
                      
                      <Card variant="dark" padding="md" className="backdrop-blur">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">👥</span>
                          </div>
                          <div>
                            <Text as="h3" weight="semibold" variant="primary">모집 인원</Text>
                            <Text variant="secondary" size="sm">
                              {recruitNotice.recruitCount ? 
                                `${recruitNotice.recruitCount}${recruitNotice.recruitMethod ? ` (${recruitNotice.recruitMethod})` : ''}` :
                                "15명 내외 (서류 + 면접)"
                              }
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 내용 */}
            <div className="mb-16">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20 p-1">
                  <div className="bg-gray-800 rounded-xl p-8 md:p-12">
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">📝</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white">모집 공고 상세</h2>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => (
                            <h1 className="text-3xl font-bold text-white mb-6 pb-3 border-b-2 border-gradient-to-r from-cyan-500 to-pink-500 bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent">
                              {children}
                            </h1>
                          ),
                          h2: ({children}) => (
                            <h2 className="text-2xl font-bold text-white mb-4 mt-8 flex items-center">
                              <span className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-pink-500 rounded-full mr-3"></span>
                              {children}
                            </h2>
                          ),
                          h3: ({children}) => (
                            <h3 className="text-xl font-semibold text-white mb-3 mt-6 flex items-center">
                              <span className="w-1.5 h-6 bg-cyan-400 rounded-full mr-2"></span>
                              {children}
                            </h3>
                          ),
                          p: ({children}) => <p className="text-gray-300 mb-4 leading-relaxed text-lg">{children}</p>,
                          ul: ({children}) => <ul className="text-gray-300 mb-6 space-y-3">{children}</ul>,
                          ol: ({children}) => <ol className="text-gray-300 mb-6 space-y-3">{children}</ol>,
                          li: ({children}) => (
                            <li className="flex items-start pl-2">
                              <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <span className="text-white text-sm font-bold">✓</span>
                              </span>
                              <span className="text-lg">{children}</span>
                            </li>
                          ),
                          strong: ({children}) => <strong className="text-white font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">{children}</strong>,
                          em: ({children}) => <em className="text-cyan-300 font-medium">{children}</em>,
                          code: ({children}) => <code className="bg-gray-700 text-cyan-300 px-3 py-1 rounded-lg text-sm font-mono border border-gray-600">{children}</code>,
                          pre: ({children}) => <pre className="bg-gray-900 text-cyan-300 p-6 rounded-xl overflow-x-auto text-sm mb-6 border border-gray-600">{children}</pre>,
                          a: ({href, children}) => (
                            <a 
                              href={href} 
                              className="text-cyan-400 hover:text-cyan-300 underline decoration-2 underline-offset-2 transition-colors font-medium" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-gradient-to-b from-cyan-500 to-pink-500 bg-gray-700/50 pl-6 py-4 italic text-gray-300 mb-6 rounded-r-lg">
                              {children}
                            </blockquote>
                          ),
                          hr: () => <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-8" />,
                          table: ({children}) => (
                            <div className="overflow-x-auto mb-6">
                              <table className="min-w-full bg-gray-700 border border-gray-600 rounded-xl overflow-hidden">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({children}) => <th className="px-6 py-4 bg-gray-600 text-white font-bold border border-gray-500">{children}</th>,
                          td: ({children}) => <td className="px-6 py-4 text-gray-300 border border-gray-600">{children}</td>
                        }}
                      >
                        {recruitNotice.bodyMd}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              
            {/* 지원하기 섹션 */}
            {recruitNotice.externalFormUrl && (
              <div className="relative mb-16">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10"></div>
                  <div className="relative text-center p-8 md:p-12">
                    <div className="mb-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-4xl">🚀</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                          AI Monster
                        </span>{' '}
                        되어보세요!
                      </h3>
                      <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        인공지능의 세계로 첫 발을 내딛을 준비가 되셨나요?<br />
                        함께 성장하고, 배우고, 꿈을 이룰 동료들이 기다리고 있어요.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <a
                        href={recruitNotice.externalFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:from-cyan-600 hover:to-pink-600 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 shadow-lg"
                      >
                        <span className="flex items-center space-x-3">
                          <span>📝</span>
                          <span>지원서 작성하기</span>
                          <span className="text-2xl">→</span>
                        </span>
                      </a>
                      
                      <div className="text-gray-400 text-sm">
                        <p className="mb-2">
                          💬 지원 관련 문의: <a href="mailto:aim@kookmin.ac.kr" className="text-cyan-400 hover:text-cyan-300 font-medium">aim@kookmin.ac.kr</a>
                        </p>
                        <p>
                          📱 더 많은 정보: <a href="https://instagram.com/aim_monsters" className="text-pink-400 hover:text-pink-300 font-medium">@aim_monsters</a>
                        </p>
                      </div>
                    </div>
                    
                    {/* 🔥 하드코딩: 마감일 카운트다운 등 추가 정보 */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-600">
                        <div className="text-3xl mb-2">⚡</div>
                        <h4 className="text-white font-bold mb-1">빠른 합격 통보</h4>
                        <p className="text-gray-400 text-sm">면접 후 3일 이내 결과 통보</p>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-600">
                        <div className="text-3xl mb-2">💪</div>
                        <h4 className="text-white font-bold mb-1">경험 무관</h4>
                        <p className="text-gray-400 text-sm">열정만 있다면 누구나 환영</p>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-600">
                        <div className="text-3xl mb-2">🎯</div>
                        <h4 className="text-white font-bold mb-1">체계적 교육</h4>
                        <p className="text-gray-400 text-sm">기초부터 실무까지 단계별 학습</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ 섹션 */}
            <div className="relative mb-16">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-1">
                  <FAQ 
                    items={faqData}
                    title="자주 묻는 질문"
                    icon="💡"
                  />
                  <div className="mt-8 text-center px-8 pb-8">
                    <Text variant="secondary">
                      더 궁금한 점이 있으시면{' '}
                      <a href="mailto:aim@kookmin.ac.kr" className="text-cyan-400 hover:text-cyan-300 font-medium">
                        aim@kookmin.ac.kr
                      </a>
                      {' '}로 문의해주세요!
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 기본 헤더 섹션 (모집 공고가 없을 때) */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  AIM
                </span>{' '}
                모집 안내
              </h1>
              <Subtitle className="mb-8">
                현재 진행중인 모집이 없습니다.<br />
                추후 모집 공고를 확인해주세요.
              </Subtitle>
              
              {/* 지난 모집 보기 버튼 */}
              <div className="flex justify-center">
                <Button
                  onClick={handleShowPastRecruits}
                  variant="ghost"
                  className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  {showPastRecruits ? '지난 모집 숨기기' : '지난 모집 보기'}
                  <span className="text-lg">
                    {showPastRecruits ? '↑' : '↓'}
                  </span>
                </Button>
              </div>
            </div>
            
            {/* 지난 모집 공고 목록 */}
            {showPastRecruits && (
              <div className="mt-16 max-w-4xl mx-auto">
                <Title level={2} align="center" className="mb-8">
                  지난 모집 공고
                </Title>
                
                {loadingPast ? (
                  <div className="py-8">
                    <Loading text="지난 모집 공고를 불러오는 중..." />
                  </div>
                ) : pastRecruits.length === 0 ? (
                  <div className="text-center py-8">
                    <Text variant="secondary">지난 모집 공고가 없습니다.</Text>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pastRecruits.map((notice) => (
                      <Card key={notice.id} padding="md">
                        <div className="flex justify-between items-start mb-4">
                          <Text as="h3" size="xl" weight="bold" variant="primary">{notice.title}</Text>
                          <Badge variant="muted">
                            마감됨
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {notice.targetAudience && (
                            <div className="text-center">
                              <Text variant="secondary" size="sm" className="mb-1">모집 대상</Text>
                              <Text variant="primary" weight="medium">{notice.targetAudience}</Text>
                            </div>
                          )}
                          {notice.recruitCount && (
                            <div className="text-center">
                              <Text variant="secondary" size="sm" className="mb-1">모집 인원</Text>
                              <Text variant="primary" weight="medium">{notice.recruitCount}</Text>
                            </div>
                          )}
                          {notice.recruitMethod && (
                            <div className="text-center">
                              <Text variant="secondary" size="sm" className="mb-1">모집 방법</Text>
                              <Text variant="primary" weight="medium">{notice.recruitMethod}</Text>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Text variant="secondary" size="sm">
                            모집 기간: {new Date(notice.startAt).toLocaleDateString()} ~ {new Date(notice.endAt).toLocaleDateString()}
                          </Text>
                          {notice.shortDescription && (
                            <Text variant="secondary" size="sm" className="max-w-md truncate">{notice.shortDescription}</Text>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 모집 공고가 없을 때는 FAQ만 표시 */}
        {!loading && !recruitNotice && (
          <>
            {/* 자주 묻는 질문 */}
            <div className="max-w-4xl mx-auto mt-16">
              <FAQ 
                items={faqData}
                title="자주 묻는 질문"
                icon="💡"
              />
            </div>
          </>
        )}

        {/* 모집 공고가 없을 때는 기본 정보 숨김 - 현재 비활성화 */}
        {false && (
          <>
        {/* 모집 정보 카드 */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">📋 모집 개요</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">모집 대상</h3>
              <p className="text-gray-300">국민대학교 재학생 (학과 무관)</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-pink-400 mb-2">모집 인원</h3>
              <p className="text-gray-300">00명 (예정)</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">지원 기간</h3>
              <p className="text-gray-300">2024년 3월 ~ 3월 (TBD)</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">활동 기간</h3>
              <p className="text-gray-300">2024년 3월 ~ 12월</p>
            </div>
          </div>
        </div>

        {/* 지원 자격 */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">✅ 지원 자격</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-300">국민대학교 재학생 (학과 무관, 학년 무관)</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-300">AI/ML에 대한 관심과 열정이 있는 학생</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-300">동아리 활동에 적극적으로 참여할 의지가 있는 학생</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-300">팀워크를 중시하고 함께 성장하고 싶은 학생</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mt-6">
              <p className="text-gray-400 text-sm">
                💡 <strong>참고:</strong> 프로그래밍 경험이나 AI/ML 지식이 없어도 괜찮습니다! 
                배우고 싶은 의지와 열정이 가장 중요합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 활동 내용 */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">🚀 주요 활동</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">정기 스터디</h3>
              <p className="text-gray-300 text-sm">
                매주 AI/ML 관련 주제를 선정하여 함께 학습하고 발표하는 시간을 가집니다.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-pink-500 transition-colors">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">팀 프로젝트</h3>
              <p className="text-gray-300 text-sm">
                실무에 적용 가능한 AI 프로젝트를 팀 단위로 진행하여 포트폴리오를 구축합니다.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-yellow-500 transition-colors">
              <div className="text-3xl mb-4">🎤</div>
              <h3 className="text-lg font-semibold text-white mb-2">세미나 & 워크샵</h3>
              <p className="text-gray-300 text-sm">
                외부 전문가 초청 세미나와 최신 기술 트렌드를 공유하는 워크샵을 개최합니다.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-white mb-2">대회 참가</h3>
              <p className="text-gray-300 text-sm">
                AI/ML 관련 대회에 팀 단위로 참가하여 실력을 검증하고 수상 경력을 쌓습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 지원 방법 */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">📝 지원 방법</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">회원가입</h3>
                <p className="text-gray-300">
                  우선 AIM 웹사이트에 회원가입을 해주세요. 
                  <Link href="/register" className="text-cyan-400 hover:text-cyan-300 ml-1">
                    여기서 가입하기 →
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">지원서 작성</h3>
                <p className="text-gray-300">
                  간단한 지원서를 작성해주세요. (자기소개, 지원동기, 관심분야 등)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">면접 (선택)</h3>
                <p className="text-gray-300">
                  필요시 간단한 면접을 진행할 수 있습니다. 부담갖지 마세요!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 연락처 & CTA */}
        <div className="bg-gradient-to-r from-cyan-600 to-pink-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요!</h2>
          <p className="text-xl mb-6">
            궁금한 점이 있으시면 언제든 연락주세요
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link
              href="/register"
              className="bg-white text-black px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg hover:shadow-white/25 transform hover:-translate-y-1 transition-all duration-300"
            >
              지금 가입하기
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
            >
              동아리 더 알아보기
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-cyan-100 mb-2">📧 <strong>이메일:</strong> aim.club@kookmin.ac.kr</p>
            <p className="text-cyan-100">📱 <strong>인스타그램:</strong> @aim_monsters_official</p>
          </div>
        </div>
        </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-black border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* 문의하기 섹션 */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-white mb-4">문의하기</h3>
              <p className="text-gray-400 mb-4">
                모집 관련 문의사항이 있으시면 운영진에게 문의 바랍니다.
              </p>
              <a 
                href="mailto:aim@kookmin.ac.kr"
                className="inline-flex items-center bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-md font-medium transition-colors"
              >
                📧 aim@kookmin.ac.kr
              </a>
            </div>
            
            {/* 빠른 링크 */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-white mb-4">빠른 링크</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  소개
                </Link>
                <Link href="/members" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  부원
                </Link>
                <Link href="/login" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                  로그인
                </Link>
              </div>
            </div>
            
            {/* 동아리 정보 */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-white mb-4">AIM</h3>
              <p className="text-gray-400 mb-2">
                AI Monsters
              </p>
              <p className="text-gray-400 text-sm">
                국민대학교 AI와 머신러닝 동아리
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400">&copy; 2024 AIM (AI Monsters). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
