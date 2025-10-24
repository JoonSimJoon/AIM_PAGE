'use client'

import { useEffect, useState } from 'react'
import { Card, Text, Title, Subtitle, Loading } from '@/components/ui'
import { get } from '@/lib/api-client'
import { APP_NAME } from '@/lib/config'

interface AboutSection {
  id: string
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
  const [sections, setSections] = useState<AboutSection[]>([])
  const [activities, setActivities] = useState<AboutActivity[]>([])
  const [history, setHistory] = useState<AboutHistory[]>([])
  const [contacts, setContacts] = useState<AboutContact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `About - ${APP_NAME}`
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const [sectionsRes, activitiesRes, historyRes, contactsRes] = await Promise.all([
        get('/api/content/about/sections'),
        get('/api/content/about/activities'),
        get('/api/content/about/history'),
        get('/api/content/about/contact')
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

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { border: string; text: string } } = {
      'cyan': { border: 'hover:border-cyan-500', text: 'text-cyan-400' },
      'pink': { border: 'hover:border-pink-500', text: 'text-pink-400' },
      'yellow': { border: 'hover:border-yellow-500', text: 'text-yellow-400' },
      'purple': { border: 'hover:border-purple-500', text: 'text-purple-400' },
      'green': { border: 'hover:border-green-500', text: 'text-green-400' },
      'blue': { border: 'hover:border-blue-500', text: 'text-blue-400' },
      'red': { border: 'hover:border-red-500', text: 'text-red-400' },
      'orange': { border: 'hover:border-orange-500', text: 'text-orange-400' }
    }
    
    return colorMap[color] || colorMap['cyan']
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <Title level={1} className="text-white mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AIM (AI Monsters)
            </span>{' '}
            동아리 소개
          </Title>
          
          {sections.map((section) => (
            <section key={section.id} className="mb-8">
              <Title level={2} className="text-white mb-4">{section.title}</Title>
              <Text variant="primary" className="leading-relaxed">
                {section.content}
              </Text>
            </section>
          ))}

          {activities.length > 0 && (
            <section className="mb-8">
              <Title level={2} className="text-white mb-4">주요 활동</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((activity) => {
                  const colorClasses = getColorClasses(activity.color)
                  return (
                    <Card 
                      key={activity.id} 
                      className={`border border-gray-600 bg-gray-700 ${colorClasses.border} transition-colors`}
                    >
                      <div className="p-4">
                        <Title level={3} className={`text-lg mb-2 ${colorClasses.text}`}>
                          {activity.icon} {activity.title}
                        </Title>
                        <Text variant="secondary" size="sm">
                          {activity.description}
                        </Text>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

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
