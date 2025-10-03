'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Text, Title, Subtitle, Loading, Modal } from '@/components/ui'

interface Member {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  profile: {
    id: string
    displayName: string
    studentId?: string
    position?: string
    department?: string
    year?: string
    bio?: string
    isPublic: boolean
  } | null
}

interface EditMemberData {
  name: string
  email: string
  role: string
  displayName: string
  studentId: string
  position: string
  department: string
  year: string
  bio: string
  isPublic: boolean
}

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState<EditMemberData>({
    name: '',
    email: '',
    role: 'member',
    displayName: '',
    studentId: '',
    position: '',
    department: '',
    year: '',
    bio: '',
    isPublic: true
  })
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    confirmText?: string
    onConfirm?: () => void
    hiding?: boolean
  }>({
    show: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: '',
    onConfirm: undefined,
    hiding: false
  })

  const validateEmailDomain = (email: string): boolean => {
    // 테스트/운영자 계정 예외 처리
    const allowedTestEmails = [
      'aim2024@aim.com',
      'test@example.com',
      'admin@aim.com'
    ];
    
    if (allowedTestEmails.includes(email.toLowerCase())) {
      return true;
    }
    
    // 일반 사용자는 @kookmin.ac.kr 도메인만 허용
    return email.toLowerCase().endsWith('@kookmin.ac.kr');
  };

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string, confirmText?: string, onConfirm?: () => void) => {
    setNotification({
      show: true,
      type,
      title,
      message,
      confirmText,
      onConfirm,
      hiding: false
    })
    
    // 확인 버튼이 없는 경우 3초 후 자동으로 사라지게 설정
    if (!confirmText) {
      setTimeout(() => {
        hideNotification()
      }, 3000)
    }
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, hiding: true }))
    // 애니메이션 후 완전히 제거
    setTimeout(() => {
      setNotification({
        show: false,
        type: 'info',
        title: '',
        message: '',
        confirmText: '',
        onConfirm: undefined,
        hiding: false
      })
    }, 300)
  }

  const handleNotificationConfirm = () => {
    if (notification.onConfirm) {
      notification.onConfirm()
    }
    hideNotification()
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/members/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      } else if (response.status === 401) {
        showNotification('error', '인증 오류', '로그인이 만료되었습니다. 다시 로그인해주세요.')
        // 토큰 제거하고 로그인 페이지로 리다이렉트
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else {
        showNotification('error', '조회 실패', '멤버 목록을 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('멤버 목록 로딩 실패:', error)
      showNotification('error', '오류 발생', '멤버 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingMember(null)
    setFormData({
      name: '',
      email: '',
      role: 'member',
      displayName: '',
      studentId: '',
      position: '',
      department: '',
      year: '',
      bio: '',
      isPublic: true
    })
    setShowModal(true)
  }

  const openEditModal = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      displayName: member.profile?.displayName || member.name,
      studentId: member.profile?.studentId || '',
      position: member.profile?.position || '',
      department: member.profile?.department || '',
      year: member.profile?.year || '',
      bio: member.profile?.bio || '',
      isPublic: member.profile?.isPublic ?? true
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMember(null)
    setFormData({
      name: '',
      email: '',
      role: 'member',
      displayName: '',
      studentId: '',
      position: '',
      department: '',
      year: '',
      bio: '',
      isPublic: true
    })
  }

  const handleSubmit = async () => {
    // 이메일 도메인 검증
    if (formData.email && !validateEmailDomain(formData.email)) {
      showNotification('warning', '이메일 형식 오류', '국민대학교 이메일(@kookmin.ac.kr)을 사용해주세요.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const url = editingMember 
        ? `/api/members/admin/${editingMember.id}`
        : '/api/members/admin'
      const method = editingMember ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        showNotification('success', '완료', `멤버가 성공적으로 ${editingMember ? '수정' : '추가'}되었습니다.`)
        closeModal()
        fetchMembers()
      } else {
        const errorData = await response.json()
        showNotification('error', '실패', errorData.message || `멤버 ${editingMember ? '수정' : '추가'}에 실패했습니다.`)
      }
    } catch (error) {
      console.error('멤버 처리 실패:', error)
      showNotification('error', '오류 발생', `멤버 ${editingMember ? '수정' : '추가'} 중 오류가 발생했습니다.`)
    }
  }

  const openDeleteModal = (member: Member) => {
    setDeletingMember(member)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingMember(null)
  }

  const confirmDelete = async () => {
    if (!deletingMember) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/members/admin/${deletingMember.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showNotification('success', '삭제 완료', '멤버가 삭제되었습니다.')
        closeDeleteModal()
        fetchMembers()
      } else {
        const errorData = await response.json()
        showNotification('error', '삭제 실패', errorData.message || '멤버 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('멤버 삭제 실패:', error)
      showNotification('error', '오류 발생', '멤버 삭제 중 오류가 발생했습니다.')
    }
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading text="멤버 목록을 불러오는 중..." size="lg" />
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title level={1} className="text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AIM
            </span>{' '}
            멤버 관리
          </Title>
          <Subtitle className="text-gray-400">
            동아리 멤버들의 정보를 관리합니다.
          </Subtitle>
        </div>
        <Button onClick={openAddModal} variant="primary">
          + 새 멤버 추가
        </Button>
      </div>

      {/* 멤버 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="hover:border-cyan-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {(member.profile?.displayName || member.name).charAt(0)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm px-2 py-1 bg-gray-700 rounded border border-gray-600 hover:border-cyan-500 transition-colors"
                >
                  ✏️ 편집
                </button>
                <button
                  onClick={() => openDeleteModal(member)}
                  className="text-red-400 hover:text-red-300 text-sm px-2 py-1 bg-gray-700 rounded border border-gray-600 hover:border-red-500 transition-colors"
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Title level={3} className="text-white">
                {member.profile?.displayName || member.name}
              </Title>
              <Text variant="secondary" size="sm">
                {member.email}
              </Text>
              {member.profile?.studentId && (
                <Text variant="muted" size="sm">
                  학번: {member.profile.studentId}
                </Text>
              )}
              {member.profile?.department && (
                <Text variant="muted" size="sm">
                  {member.profile.department}
                </Text>
              )}
              {member.profile?.year && (
                <Text variant="muted" size="sm">
                  {member.profile.year}
                </Text>
              )}
              {member.profile?.position && (
                <Text variant="muted" size="sm">
                  {member.profile.position}
                </Text>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.role === 'admin' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {member.role === 'admin' ? '관리자' : '일반 멤버'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 멤버 모달 */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingMember ? '멤버 정보 수정' : '새 멤버 추가'}
        onSubmit={handleSubmit}
        submitText={editingMember ? '수정' : '추가'}
        maxWidth="4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">이름 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">이메일 *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full bg-gray-700 border text-white px-4 py-2 rounded-lg focus:ring-2 ${
                formData.email && !validateEmailDomain(formData.email) 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-600 focus:ring-cyan-500 focus:border-transparent'
              }`}
              placeholder="student@kookmin.ac.kr"
              required
            />
            {formData.email && !validateEmailDomain(formData.email) && (
              <p className="mt-1 text-sm text-red-400">
                국민대학교 이메일(@kookmin.ac.kr)을 사용해주세요.
              </p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">표시명</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="표시할 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">학번</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="학번을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">학과</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="학과를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">학년</label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">선택해주세요</option>
              <option value="1학년">1학년</option>
              <option value="2학년">2학년</option>
              <option value="3학년">3학년</option>
              <option value="4학년">4학년</option>
              <option value="대학원생">대학원생</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">직책</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="직책을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">역할 *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            >
              <option value="member">일반 멤버</option>
              <option value="admin">관리자</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-white font-medium mb-2">자기소개</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="간단한 자기소개를 작성해주세요"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm text-white">프로필 공개</span>
          </label>
        </div>
      </Modal>

      {/* 알림 */}
      {notification.show && (
        <>
          {/* 중앙 모달 (확인 버튼이 있는 경우) */}
          {notification.confirmText && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                  {notification.type === 'success' && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                  {notification.type === 'error' && (
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✕</span>
                    </div>
                  )}
                  {notification.type === 'warning' && (
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">⚠</span>
                    </div>
                  )}
                  {notification.type === 'info' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">ℹ</span>
                    </div>
                  )}
                  <Title level={4} className="text-white">
                    {notification.title}
                  </Title>
                </div>
                {notification.message && (
                  <Text variant="secondary" className="mb-4">
                    {notification.message}
                  </Text>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleNotificationConfirm}
                    className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                      notification.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                      notification.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      notification.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-cyan-600 hover:bg-cyan-700'
                    }`}
                  >
                    {notification.confirmText}
                  </button>
                  <button
                    onClick={hideNotification}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 우상단 토스트 (자동 사라짐) */}
          {!notification.confirmText && (
            <div className={`fixed top-4 right-4 z-50 bg-gray-800 border ${
              notification.type === 'success' ? 'border-green-500' : 
              notification.type === 'error' ? 'border-red-500' :
              notification.type === 'warning' ? 'border-yellow-500' :
              'border-blue-500'
            } rounded-lg p-4 w-80 shadow-2xl ${
              notification.hiding ? 'animate-slide-out-right' : 'animate-slide-in-right'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-1 h-full absolute left-0 top-0 bottom-0 rounded-l-lg ${
                  notification.type === 'success' ? 'bg-green-500' : 
                  notification.type === 'error' ? 'bg-red-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <span className="text-2xl ml-2">
                  {notification.type === 'success' ? '✓' : 
                   notification.type === 'error' ? '⚠️' :
                   notification.type === 'warning' ? '⚠️' :
                   'ℹ️'}
                </span>
                <div className="flex-1">
                  <Title level={4} className={`mb-1 ${
                    notification.type === 'success' ? 'text-green-400' : 
                    notification.type === 'error' ? 'text-red-400' :
                    notification.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {notification.title}
                  </Title>
                  {notification.message && (
                    <Text variant="secondary" size="sm">
                      {notification.message}
                    </Text>
                  )}
                </div>
                <Button onClick={hideNotification} variant="ghost" size="sm" className="hover:bg-gray-700 -mt-1">
                  ✕
                </Button>
              </div>
              {/* 진행 바 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
                <div className={`h-full ${
                  notification.type === 'success' ? 'bg-green-500' : 
                  notification.type === 'error' ? 'bg-red-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                } animate-progress`}></div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        submitText="삭제"
        onSubmit={confirmDelete}
        title="삭제 확인"
      >
        <div className="space-y-4">
          <Text className="text-white">
            {deletingMember && (
              <>
                <span className="font-semibold text-red-400">
                  "{deletingMember.name}"
                </span>
                님을 삭제하시겠습니까?
              </>
            )}
          </Text>
          <Text variant="secondary" size="sm">
            이 작업은 되돌릴 수 없습니다.
          </Text>
          
        </div>
      </Modal>
    </div>
  )
}