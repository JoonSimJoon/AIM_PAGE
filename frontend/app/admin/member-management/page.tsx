'use client'

import { useEffect, useState } from 'react'

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
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editData, setEditData] = useState<EditMemberData>({
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
  const [showAddForm, setShowAddForm] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    onConfirm?: () => void
    confirmText?: string
    showCancel?: boolean
  }>({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: undefined,
    confirmText: '확인',
    showCancel: false
  })

  useEffect(() => {
    // 페이지 제목 설정
    document.title = 'Member Management - AIM: AI Monsters'
    
    fetchMembers()
  }, [])

  // 알림 헬퍼 함수들
  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    onConfirm?: () => void,
    confirmText?: string,
    showCancel?: boolean
  ) => {
    setNotification({
      show: true,
      type,
      title,
      message,
      onConfirm,
      confirmText: confirmText || '확인',
      showCancel: showCancel || false
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  const handleNotificationConfirm = () => {
    if (notification.onConfirm) {
      notification.onConfirm()
    }
    hideNotification()
  }

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/members/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMembers(data)
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

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setEditData({
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
  }

  const handleSave = async () => {
    if (!editingMember) return

    // 이메일 도메인 검증
    if (editData.email && !validateEmailDomain(editData.email)) {
      showNotification('warning', '이메일 형식 오류', '국민대학교 이메일(@kookmin.ac.kr)을 사용해주세요.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/members/admin/${editingMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        showNotification('success', '업데이트 완료', '멤버 정보가 업데이트되었습니다.')
        setEditingMember(null)
        fetchMembers()
      } else {
        const errorData = await response.json()
        showNotification('error', '업데이트 실패', errorData.error)
      }
    } catch (error) {
      console.error('멤버 업데이트 실패:', error)
      showNotification('error', '오류 발생', '멤버 정보 업데이트 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (member: Member) => {
    showNotification('warning', '삭제 확인', `정말로 ${member.name}님을 삭제하시겠습니까?`, 
      () => performDelete(member), '삭제', true)
  }

  const performDelete = async (member: Member) => {

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/members/admin/${member.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showNotification('success', '삭제 완료', '멤버가 삭제되었습니다.')
        fetchMembers()
      } else {
        const errorData = await response.json()
        showNotification('error', '삭제 실패', errorData.error)
      }
    } catch (error) {
      console.error('멤버 삭제 실패:', error)
      showNotification('error', '오류 발생', '멤버 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleAdd = async () => {
    // 이메일 도메인 검증
    if (!validateEmailDomain(editData.email)) {
      showNotification('warning', '이메일 형식 오류', '국민대학교 이메일(@kookmin.ac.kr)을 사용해주세요.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/members/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        showNotification('success', '추가 완료', '새 멤버가 추가되었습니다.')
        setShowAddForm(false)
        setEditData({
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
        fetchMembers()
      } else {
        const errorData = await response.json()
        showNotification('error', '추가 실패', errorData.error)
      }
    } catch (error) {
      console.error('멤버 추가 실패:', error)
      showNotification('error', '오류 발생', '멤버 추가 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">멤버 목록을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AIM
            </span>{' '}
            멤버 관리
          </h1>
          <p className="mt-2 text-gray-600">동아리 멤버들의 정보를 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
        >
          + 새 멤버 추가
        </button>
      </div>

      {/* 멤버 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:border-cyan-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {(member.profile?.displayName || member.name).charAt(0)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm px-2 py-1 bg-gray-700 rounded border border-gray-600 hover:border-cyan-500 transition-colors"
                >
                  ✏️ 편집
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  className="text-red-400 hover:text-red-300 text-sm px-2 py-1 bg-gray-700 rounded border border-gray-600 hover:border-red-500 transition-colors"
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {member.profile?.displayName || member.name}
              </h3>
              
              <div className="text-sm text-gray-300 space-y-1">
                <p><span className="font-medium text-gray-400">이메일:</span> {member.email}</p>
                <p><span className="font-medium text-gray-400">학번:</span> {member.profile?.studentId || '미설정'}</p>
                <p><span className="font-medium text-gray-400">학과:</span> {member.profile?.department || '미설정'}</p>
                <p><span className="font-medium text-gray-400">학년:</span> {member.profile?.year || '미설정'}</p>
                <p><span className="font-medium text-gray-400">역할:</span> {member.profile?.position || '부원'}</p>
                <p><span className="font-medium text-gray-400">권한:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    member.role === 'admin' ? 'bg-pink-600 text-white' : 'bg-cyan-600 text-white'
                  }`}>
                    {member.role === 'admin' ? '관리자' : '일반 멤버'}
                  </span>
                </p>
                <p><span className="font-medium text-gray-400">공개 여부:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    member.profile?.isPublic ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {member.profile?.isPublic ? '공개' : '비공개'}
                  </span>
                </p>
              </div>
              
              {member.profile?.bio && (
                <p className="text-sm text-gray-300 mt-3 p-2 bg-gray-700 border border-gray-600 rounded">
                  {member.profile.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 편집 모달 */}
      {(editingMember || showAddForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingMember ? '멤버 정보 편집' : '새 멤버 추가'}
              </h2>
              <button
                onClick={() => {
                  setEditingMember(null)
                  setShowAddForm(false)
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">이름</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">이메일</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    editData.email && !validateEmailDomain(editData.email) 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-600 focus:ring-cyan-500 focus:border-cyan-500'
                  }`}
                  placeholder="예: student@kookmin.ac.kr"
                />
                {editData.email && !validateEmailDomain(editData.email) && (
                  <p className="mt-1 text-sm text-red-400">
                    국민대학교 이메일(@kookmin.ac.kr)을 사용해주세요.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">표시명</label>
                <input
                  type="text"
                  value={editData.displayName}
                  onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">학번</label>
                <input
                  type="text"
                  value={editData.studentId}
                  onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">학과</label>
                <input
                  type="text"
                  value={editData.department}
                  onChange={(e) => setEditData({...editData, department: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">학년</label>
                <select
                  value={editData.year}
                  onChange={(e) => setEditData({...editData, year: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                <label className="block text-sm font-medium text-white mb-1">동아리 역할</label>
                <select
                  value={editData.position}
                  onChange={(e) => setEditData({...editData, position: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">선택해주세요</option>
                  <option value="회장">회장</option>
                  <option value="부회장">부회장</option>
                  <option value="기획팀장">기획팀장</option>
                  <option value="개발팀장">개발팀장</option>
                  <option value="홍보팀장">홍보팀장</option>
                  <option value="부원">부원</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">시스템 권한</label>
                <select
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="member">일반 멤버</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-1">자기소개</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="간단한 자기소개를 입력해주세요..."
              />
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.isPublic}
                  onChange={(e) => setEditData({...editData, isPublic: e.target.checked})}
                  className="rounded bg-gray-700 border-gray-600 text-cyan-400 focus:ring-cyan-500"
                />
                <span className="ml-2 text-sm text-white">공개 프로필로 설정</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingMember(null)
                  setShowAddForm(false)
                }}
                className="px-4 py-2 border border-gray-600 rounded-md text-white bg-gray-700 hover:bg-gray-600"
              >
                취소
              </button>
              <button
                onClick={editingMember ? handleSave : handleAdd}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
              >
                {editingMember ? '저장' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 통합 알림 대화상자 */}
      {notification.show && (
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
                  <span className="text-white text-sm">!</span>
                </div>
              )}
              {notification.type === 'info' && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">i</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">
                {notification.title}
              </h3>
            </div>
            
            {notification.message && (
              <p className="text-gray-300 mb-6">
                {notification.message}
              </p>
            )}
            
            <div className="flex gap-3 justify-end">
              {notification.showCancel && (
                <button
                  onClick={hideNotification}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  취소
                </button>
              )}
              <button
                onClick={handleNotificationConfirm}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  notification.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                  notification.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  notification.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                {notification.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
