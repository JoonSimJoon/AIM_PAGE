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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)
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
    hiding?: boolean
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
    hiding: false
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
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/content/about/${activeTab}/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        switch (activeTab) {
          case 'sections':
            setSections(data)
            break
          case 'activities':
            setActivities(data)
            break
          case 'history':
            setHistory(data)
            break
          case 'contact':
            setContacts(data)
            break
        }
      } else {
        console.error('API 호출 실패:', response.status)
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

  const openDeleteModal = (item: any) => {
    setDeletingItem(item)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingItem(null)
  }

  const confirmDelete = async () => {
    if (!deletingItem) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/content/about/${activeTab}/${deletingItem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        showNotification({
          show: true,
          type: 'success',
          title: '삭제 완료',
          message: '항목이 성공적으로 삭제되었습니다.'
        })
        closeDeleteModal()
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
      const token = localStorage.getItem('token')
      const url = editingItem 
        ? `http://localhost:3001/api/content/about/${activeTab}/${editingItem.id}`
        : `http://localhost:3001/api/content/about/${activeTab}`
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    // 3초 후 자동으로 사라지게 설정
    setTimeout(() => {
      hideNotification()
    }, 3000)
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, hiding: true }))
    // 애니메이션 후 완전히 제거
    setTimeout(() => {
      setNotification({ show: false, type: 'success', title: '', message: '', hiding: false })
    }, 300)
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
                        item.color === 'purple' ? 'bg-purple-500 text-white' :
                        item.color === 'green' ? 'bg-green-500 text-white' :
                        item.color === 'blue' ? 'bg-blue-500 text-white' :
                        item.color === 'red' ? 'bg-red-500 text-white' :
                        item.color === 'orange' ? 'bg-orange-500 text-white' :
                        'bg-cyan-500 text-black'
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
                  <Button onClick={() => openDeleteModal(item)} variant="ghost" size="sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">타입 *</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">타입을 선택하세요</option>
                <option value="intro">소개</option>
                <option value="mission">미션</option>
                <option value="vision">비전</option>
              </select>
            </div>
            
              <div>
                <label className="block text-white font-medium mb-2">제목 *</label>
                <input
                  type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="섹션 제목을 입력하세요"
                  required
                />
              </div>

            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">내용 *</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows={6}
                placeholder="섹션 내용을 입력하세요"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">순서</label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        )}
                  
        {activeTab === 'activities' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
              <label className="block text-white font-medium mb-2">제목 *</label>
                    <input
                      type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="활동 제목을 입력하세요"
                required
                    />
                  </div>
                  
                  <div>
              <label className="block text-white font-medium mb-2">아이콘 *</label>
                    <input
                      type="text"
                value={formData.icon || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="🚀"
                required
                    />
                  </div>
                  
                  <div>
              <label className="block text-white font-medium mb-2">색상 *</label>
              <select
                value={formData.color || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">색상을 선택하세요</option>
                <option value="cyan">Cyan</option>
                <option value="pink">Pink</option>
                <option value="yellow">Yellow</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">설명 *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows={4}
                placeholder="활동 설명을 입력하세요"
                required
                    />
                  </div>
                  
                  <div>
              <label className="block text-white font-medium mb-2">순서</label>
                    <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="0"
                    />
                  </div>
                </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label className="block text-white font-medium mb-2">연도 *</label>
              <input
                type="number"
                value={formData.year || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="예: 2024"
                      required
                    />
                  </div>
                  
                  <div>
              <label className="block text-white font-medium mb-2">제목 *</label>
                  <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="연혁 제목을 입력하세요"
                    required
                  />
                </div>
            
            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">설명 *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows={4}
                placeholder="연혁 설명을 입력하세요"
                    required
                  />
                </div>
            
            <div>
              <label className="block text-white font-medium mb-2">순서</label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">타입 *</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
              <label className="block text-white font-medium mb-2">라벨 *</label>
                <input
                type="text"
                value={formData.label || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="연락처 라벨을 입력하세요"
                required
                />
              </div>

            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">값 *</label>
                <input
                type="text"
                value={formData.value || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="연락처 값을 입력하세요"
                required
              />
              </div>

            <div>
              <label className="block text-white font-medium mb-2">순서</label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="0"
              />
              </div>
            </div>
          )}

      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onSubmit={confirmDelete}
        onClose={closeDeleteModal}
        submitText = '삭제'
        title="삭제 확인"
      >
        <div className="space-y-4">
          <Text className="text-white">
            {deletingItem && (
              <>
                <span className="font-semibold text-red-400">
                  "{deletingItem.title || deletingItem.label || '이 항목'}"
                </span>
                을(를) 삭제하시겠습니까?
              </>
            )}
          </Text>
          <Text variant="secondary" size="sm">
            이 작업은 되돌릴 수 없습니다.
          </Text>
          
        </div>
      </Modal>

      {/* 알림 */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 bg-gray-800 border ${
            notification.type === 'success' ? 'border-green-500' : 'border-red-500'
          } rounded-lg p-4 w-80 shadow-2xl ${
            notification.hiding ? 'animate-slide-out-right' : 'animate-slide-in-right'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-1 h-full absolute left-0 top-0 bottom-0 rounded-l-lg ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-2xl ml-2">
                {notification.type === 'success' ? '✓' : '⚠️'}
              </span>
              <div className="flex-1">
                <Title level={4} className={`mb-1 ${
                  notification.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {notification.title}
                </Title>
                <Text variant="secondary" size="sm">
                  {notification.message}
                </Text>
              </div>
              <Button onClick={hideNotification} variant="ghost" size="sm" className="hover:bg-gray-700 -mt-1">
                ✕
              </Button>
            </div>
            {/* 진행 바 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
              <div className={`h-full ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } animate-progress`}></div>
            </div>
        </div>
      )}
    </div>
  )
}
