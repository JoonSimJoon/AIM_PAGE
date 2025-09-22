'use client'

import { useState, useEffect } from 'react'
import { Button, Card, Text, Title, Subtitle, Loading, Modal } from '@/components/ui'

interface AboutSection {
  id: string
  type: string
  title: string
  content: string
  order: number
  isActive: boolean
}

interface AboutActivity {
  id: string
  title: string
  description: string
  icon: string
  color: string
  order: number
  isActive: boolean
}

interface AboutHistory {
  id: string
  year: number
  title: string
  description: string
  order: number
  isActive: boolean
}

interface AboutContact {
  id: string
  type: string
  label: string
  value: string
  order: number
  isActive: boolean
}

export default function AboutManagementPage() {
  const [activeTab, setActiveTab] = useState<'sections' | 'activities' | 'history' | 'contact'>('sections')
  const [sections, setSections] = useState<AboutSection[]>([])
  const [activities, setActivities] = useState<AboutActivity[]>([])
  const [history, setHistory] = useState<AboutHistory[]>([])
  const [contacts, setContacts] = useState<AboutContact[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<{
    type?: string
    title?: string
    content?: string
    description?: string
    icon?: string
    color?: string
    year?: number
    label?: string
    value?: string
    order?: number
  }>({})
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })

  useEffect(() => {
    document.title = '소개 관리 - AIM: AI Monsters'
  }, [])

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content/about/${activeTab}`)
      if (response.ok) {
        const data = await response.json()
        switch (activeTab) {
          case 'sections': setSections(data)
          case 'activities': setActivities(data)
          case 'history': setHistory(data)
          case 'contact': setContacts(data)
        }
      }
    } catch (error) {
      console.error('데이터 로딩 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({})
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({ ...item })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/content/about/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        showNotification({
          show: true,
          type: 'success',
          title: '삭제 완료',
          message: '항목이 성공적으로 삭제되었습니다.'
        })
        fetchData()
      } else {
        showNotification({
          show: true,
          type: 'error',
          title: '삭제 실패',
          message: '항목 삭제에 실패했습니다.'
        })
      }
    } catch (error) {
      showNotification({
        show: true,
        type: 'error',
        title: '오류',
        message: '삭제 중 오류가 발생했습니다.'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingItem 
        ? `/api/content/about/${activeTab}/${editingItem.id}`
        : `/api/content/about/${activeTab}`
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        showNotification({
          show: true,
          type: 'success',
          title: editingItem ? '수정 완료' : '생성 완료',
          message: `항목이 성공적으로 ${editingItem ? '수정' : '생성'}되었습니다.`
        })
        closeModal()
        fetchData()
      } else {
        showNotification({
          show: true,
          type: 'error',
          title: editingItem ? '수정 실패' : '생성 실패',
          message: `항목 ${editingItem ? '수정' : '생성'}에 실패했습니다.`
        })
      }
    } catch (error) {
      showNotification({
        show: true,
        type: 'error',
        title: '오류',
        message: '처리 중 오류가 발생했습니다.'
      })
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'sections': return sections
      case 'activities': return activities
      case 'history': return history
      case 'contact': return contacts
      default: return []
    }
  }

  const showNotification = (notification: {
    show: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }) => {
    setNotification(notification)
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
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
      {/* 헤더 */}
      <div className="mb-8">
        <Title level={1} className="text-white mb-2">소개 관리</Title>
        <Subtitle className="text-gray-400">
          소개 페이지의 각 섹션을 관리할 수 있습니다.
        </Subtitle>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'sections', label: '소개 섹션', icon: '📝' },
            { key: 'activities', label: '주요 활동', icon: '🚀' },
            { key: 'history', label: '동아리 연혁', icon: '🗓️' },
            { key: 'contact', label: '연락처', icon: '📞' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-cyan-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 추가 버튼 */}
      <div className="mb-6">
        <Button onClick={openAddModal} variant="primary">
          + 새 {activeTab === 'sections' ? '소개 섹션' : activeTab === 'activities' ? '주요 활동' : activeTab === 'history' ? '동아리 연혁' : '연락처'} 추가
        </Button>
          </div>

      {/* 데이터 목록 */}
      <div className="space-y-4">
        {getCurrentData().length === 0 ? (
          <Card className="text-center py-12">
            <Text variant="secondary" size="lg">
              아직 등록된 {activeTab === 'sections' ? '소개 섹션' : activeTab === 'activities' ? '주요 활동' : activeTab === 'history' ? '동아리 연혁' : '연락처'}이 없습니다.
            </Text>
          </Card>
        ) : (
          getCurrentData().map((item: any) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Title level={3} className="text-white mb-2">
                    {item.title || item.label}
                  </Title>
                  <Text variant="secondary" className="mb-2">
                    {item.content || item.description || item.value}
                  </Text>
                  {activeTab === 'activities' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.color === 'cyan' ? 'bg-cyan-500 text-black' :
                        item.color === 'pink' ? 'bg-pink-500 text-white' :
                        item.color === 'yellow' ? 'bg-yellow-500 text-black' :
                        'bg-purple-500 text-white'
                      }`}>
                        {item.color}
                      </span>
                    </div>
                  )}
                  {activeTab === 'history' && (
                    <Text variant="muted" size="sm">
                      {item.year}년
                    </Text>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(item)} variant="ghost" size="sm">
                    수정
                  </Button>
                  <Button onClick={() => handleDelete(item.id)} variant="ghost" size="sm">
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 모달 */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingItem ? `${activeTab === 'sections' ? '소개 섹션' : activeTab === 'activities' ? '주요 활동' : activeTab === 'history' ? '동아리 연혁' : '연락처'} 수정` : `새 ${activeTab === 'sections' ? '소개 섹션' : activeTab === 'activities' ? '주요 활동' : activeTab === 'history' ? '동아리 연혁' : '연락처'} 추가`}
        onSubmit={handleSubmit}
        submitText={editingItem ? '수정' : '생성'}
        maxWidth="4xl"
      >
        {activeTab === 'sections' && (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-2">타입</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
              >
                <option value="">타입을 선택하세요</option>
                <option value="intro">소개</option>
                <option value="mission">미션</option>
                <option value="vision">비전</option>
              </select>
            </div>
              <div>
              <label className="block text-sm font-medium text-white mb-2">제목</label>
                <input
                  type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>
                  <div>
              <label className="block text-sm font-medium text-white mb-2">내용</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                rows={6}
                required
                    />
                  </div>
          </>
        )}
                  
        {activeTab === 'activities' && (
          <>
                  <div>
              <label className="block text-sm font-medium text-white mb-2">제목</label>
                    <input
                      type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
                    />
                  </div>
                  <div>
              <label className="block text-sm font-medium text-white mb-2">설명</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                rows={4}
                required
                    />
                  </div>
            <div className="grid grid-cols-2 gap-4">
                  <div>
                <label className="block text-sm font-medium text-white mb-2">아이콘</label>
                    <input
                      type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="🚀"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">색상</label>
                <select
                  value={formData.color || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">색상을 선택하세요</option>
                  <option value="cyan">Cyan</option>
                  <option value="pink">Pink</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
                    </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-2">연도</label>
              <input
                type="number"
                value={formData.year || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
              <label className="block text-sm font-medium text-white mb-2">제목</label>
                  <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
              <label className="block text-sm font-medium text-white mb-2">설명</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                rows={4}
                    required
                  />
                </div>
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-2">타입</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
              >
                <option value="">타입을 선택하세요</option>
                <option value="email">Email</option>
                <option value="github">GitHub</option>
                <option value="instagram">Instagram</option>
                <option value="discord">Discord</option>
              </select>
              </div>
              <div>
              <label className="block text-sm font-medium text-white mb-2">라벨</label>
                <input
                type="text"
                value={formData.label || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
                />
              </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">값</label>
                <input
                type="text"
                value={formData.value || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-white mb-2">순서</label>
          <input
            type="number"
            value={formData.order || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </Modal>

      {/* 알림 */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm">
          <div className="flex items-start">
            <div className="flex-1">
              <Title level={4} className="text-white mb-1">
                {notification.title}
              </Title>
              <Text variant="secondary" size="sm">
                {notification.message}
              </Text>
            </div>
            <Button onClick={hideNotification} variant="ghost" size="sm" className="ml-2">
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
