'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, Text, Title, Subtitle, Loading } from '@/components/ui'

interface AboutSection {
  id: string
  type: string
  title: string
  content: string
  order: number
}

interface AboutActivity {
  id: string
  title: string
  description: string
  icon: string
  color: string
  order: number
}

interface AboutHistory {
  id: string
  year: number
  title: string
  description: string
  order: number
}

interface AboutContact {
  id: string
  type: string
  label: string
  value: string
  order: number
}

export default function AboutPage() {
  const [user, setUser] = useState<any>(null)
  const [sections, setSections] = useState<AboutSection[]>([])
  const [activities, setActivities] = useState<AboutActivity[]>([])
  const [history, setHistory] = useState<AboutHistory[]>([])
  const [contacts, setContacts] = useState<AboutContact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 제목 설정
    document.title = 'About - AIM: AI Monsters'
    
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // 소개 데이터 로드
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const [sectionsRes, activitiesRes, historyRes, contactsRes] = await Promise.all([
        fetch('/api/content/about/sections'),
        fetch('/api/content/about/activities'),
        fetch('/api/content/about/history'),
        fetch('/api/content/about/contact')
      ])

      if (sectionsRes.ok) {
        const sectionsData = await sectionsRes.json()
        setSections(sectionsData)
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setActivities(activitiesData)
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setHistory(historyData)
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json()
        setContacts(contactsData)
      }
    } catch (error) {
      console.error('소개 데이터 로드 오류:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex justify-center items-center h-screen">
          <Loading text="소개 내용을 불러오는 중..." size="lg" />
        </div>
      </div>
    )
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
              <Link href="/about" className="text-cyan-400 font-medium">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <Title level={1} className="text-white mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AIM (AI Monsters)
            </span>{' '}
            동아리 소개
          </Title>
          
          {/* 동아리 개요 - DB에서 가져온 섹션들 */}
          {sections.map((section) => (
            <section key={section.id} className="mb-8">
              <Title level={2} className="text-white mb-4">{section.title}</Title>
              <Text variant="primary" className="leading-relaxed">
                {section.content}
              </Text>
            </section>
          ))}

          {/* 활동 내용 - DB에서 가져온 활동들 */}
          {activities.length > 0 && (
            <section className="mb-8">
              <Title level={2} className="text-white mb-4">주요 활동</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((activity) => (
                  <Card key={activity.id} className={`border border-gray-600 bg-gray-700 hover:border-${activity.color}-500 transition-colors`}>
                    <div className="p-4">
                      <Title level={3} className={`text-lg mb-2 text-${activity.color}-400`}>
                        {activity.icon} {activity.title}
                      </Title>
                      <Text variant="secondary" size="sm">
                        {activity.description}
                      </Text>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 동아리 역사 - DB에서 가져온 연혁들 */}
          {history.length > 0 && (
            <section className="mb-8">
              <Title level={2} className="text-white mb-4">동아리 연혁</Title>
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-cyan-400">
                      {item.year}
                    </div>
                    <div>
                      <Title level={4} className="text-white">{item.title}</Title>
                      <Text variant="secondary" size="sm">
                        {item.description}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 연락처 - DB에서 가져온 연락처들 */}
          {contacts.length > 0 && (
            <section>
              <Title level={2} className="text-white mb-4">Contact</Title>
              <Card variant="dark" className="p-4">
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div key={contact.id}>
                      <Text variant="primary">
                        <strong className="text-white">{contact.label}:</strong> {contact.value}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}
        </Card>
      </main>
    </div>
  )
}