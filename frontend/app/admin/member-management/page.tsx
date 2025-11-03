'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Text, Title, Subtitle, Loading, Modal } from '@/components/ui'
import { DataTable } from '@/components/ui/DataTable'
import { CardGrid } from '@/components/ui/CardGrid'
import { ViewToggle } from '@/components/ui/ViewToggle'
import { MemberCard } from '@/components/member/MemberCard'

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
    generation?: number
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
  generation: number
  bio: string
  isPublic: boolean
}

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCsvModal, setShowCsvModal] = useState(false)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [formData, setFormData] = useState<EditMemberData>({
    name: '',
    email: '',
    role: 'member',
    displayName: '',
    studentId: '',
    position: '',
    department: '',
    year: '',
    generation: 0,
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
      generation: 0,
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
      generation: member.profile?.generation || 0,
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
      generation: 0,
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

  const openCsvModal = () => {
    setCsvFile(null)
    setShowCsvModal(true)
  }

  const closeCsvModal = () => {
    setShowCsvModal(false)
    setCsvFile(null)
    // 파일 입력 필드 초기화
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // 파일 유효성 검사
      if (!file.name.toLowerCase().endsWith('.csv')) {
        showNotification('warning', '파일 형식 오류', 'CSV 파일만 업로드 가능합니다.')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        showNotification('warning', '파일 크기 초과', '파일 크기는 5MB 이하여야 합니다.')
        return
      }
      
      console.log('선택된 파일 정보:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified)
      })
      
      setCsvFile(file)
    }
  }

  const parseCsvFile = async (file: File): Promise<any[]> => {
    // 먼저 EUC-KR로 시도
    const tryParseWithEncoding = (encoding: string): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        // 파일 상태 확인
        if (!file || !(file instanceof File)) {
          reject(new Error('유효하지 않은 파일입니다.'))
          return
        }

        if (file.size === 0) {
          reject(new Error('빈 파일입니다.'))
          return
        }

        const reader = new FileReader()
        
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string
            
            if (!text || text.trim().length === 0) {
              reject(new Error('CSV 파일이 비어있습니다.'))
              return
            }

            console.log(`[${encoding}] CSV 파일 내용 미리보기:`, text.substring(0, 200))

            // 한글이 깨졌는지 확인
            const hasGarbledKorean = /[\uFFFD�]/.test(text.substring(0, 500))
            if (hasGarbledKorean && encoding === 'UTF-8') {
              reject(new Error('ENCODING_ERROR'))
              return
            }

            // 줄바꿈 처리 (Windows, Unix, Mac 모두 지원)
            const lines = text.split(/\r?\n/).filter(line => line.trim())
            
            if (lines.length < 2) {
              reject(new Error('CSV 파일에 데이터가 없습니다. (헤더만 있거나 비어있음)'))
              return
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
            console.log('CSV 헤더:', headers)
            
            const members = []

            for (let i = 1; i < lines.length; i++) {
              // 간단한 split으로 먼저 시도
              const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
              
              const member: any = {}

              headers.forEach((header, index) => {
                const value = values[index]
                if (value) {
                  // 특정 필드 타입 변환
                  if (header === 'generation') {
                    member[header] = value ? parseInt(value) : null
                  } else if (header === 'isPublic') {
                    member[header] = value.toLowerCase() === 'true'
                  } else {
                    member[header] = value
                  }
                }
              })

              if (member.email && member.name) {
                members.push(member)
              }
            }

            console.log('파싱된 멤버 수:', members.length)

            if (members.length === 0) {
              reject(new Error('유효한 멤버 데이터가 없습니다. email과 name은 필수입니다.'))
              return
            }

            resolve(members)
          } catch (error) {
            console.error('CSV 파싱 오류:', error)
            reject(new Error(`CSV 파싱 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`))
          }
        }
        
        reader.onloadstart = () => {
          console.log(`[${encoding}] 파일 읽기 시작:`, file.name)
        }
        
        reader.onerror = (e) => {
          console.error('파일 읽기 오류 상세:', {
            error: e,
            readyState: reader.readyState,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          })
          reject(new Error('파일을 읽는 중 오류가 발생했습니다.'))
        }
        
        reader.onabort = () => {
          reject(new Error('파일 읽기가 중단되었습니다.'))
        }
        
        // 파일 읽기 시작
        try {
          console.log(`[${encoding}] FileReader로 파일 읽기 시작`)
          reader.readAsText(file, encoding)
        } catch (error) {
          console.error('readAsText 호출 오류:', error)
          reject(new Error(`파일 읽기를 시작할 수 없습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`))
        }
      })
    }

    // UTF-8로 먼저 시도
    try {
      return await tryParseWithEncoding('UTF-8')
    } catch (error) {
      // UTF-8 실패 시 EUC-KR로 재시도
      if (error instanceof Error && error.message === 'ENCODING_ERROR') {
        console.log('UTF-8 인코딩 실패, EUC-KR로 재시도...')
        try {
          return await tryParseWithEncoding('EUC-KR')
        } catch (eucError) {
          // EUC-KR도 실패하면 CP949 시도
          console.log('EUC-KR 인코딩 실패, CP949로 재시도...')
          return await tryParseWithEncoding('CP949')
        }
      }
      throw error
    }
  }

  const handleCsvUpload = async () => {
    if (!csvFile) {
      showNotification('warning', '파일 선택', 'CSV 파일을 선택해주세요.')
      return
    }

    try {
      setCsvUploading(true)
      const members = await parseCsvFile(csvFile)

      if (members.length === 0) {
        showNotification('warning', '데이터 없음', '유효한 멤버 데이터가 없습니다.')
        return
      }

      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/members/admin/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ members })
      })

      const data = await response.json()

      if (response.ok) {
        const successCount = data.results.success.length
        const failedCount = data.results.failed.length
        const skippedCount = data.results.failed.filter((f: any) => f.reason.includes('이미 등록된')).length
        
        let message = `${successCount}명의 계정이 생성되었습니다.`
        if (skippedCount > 0) {
          message += `\n${skippedCount}명은 이미 존재하여 건너뛰었습니다.`
        }
        if (failedCount - skippedCount > 0) {
          message += `\n${failedCount - skippedCount}명 실패 (오류)`
        }
        
        if (failedCount > 0) {
          console.log('건너뛴/실패 목록:', data.results.failed)
        }

        showNotification('success', 'CSV 업로드 완료', message)
        closeCsvModal()
        fetchMembers()

        // 성공한 계정의 초기 비밀번호 정보 표시
        if (data.results.success.length > 0) {
          console.log('=== 생성된 계정 목록 ===')
          data.results.success.forEach((s: any) => {
            console.log(`📧 ${s.email} - 초기 비밀번호: ${s.initialPassword}`)
          })
        }
      } else {
        showNotification('error', '업로드 실패', data.error || 'CSV 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('CSV 업로드 오류:', error)
      showNotification('error', '오류 발생', error instanceof Error ? error.message : 'CSV 파일 처리 중 오류가 발생했습니다.')
    } finally {
      setCsvUploading(false)
    }
  }

  const downloadCsvTemplate = () => {
    const template = `email,name,displayName,studentId,position,department,year,generation,role,isPublic
kim123@kookmin.ac.kr,김철수,철수,20241234,부원,소프트웨어학부,2,3,member,true
lee456@kookmin.ac.kr,이영희,영희,20231111,운영진,인공지능학부,3,2,member,true`
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'member_template.csv'
    link.click()
  }

  // 다중 선택 관련 함수들
  const handleSelectionChange = (selectedItems: Member[]) => {
    setSelectedMembers(selectedItems)
  }

  const handleBulkAction = async (action: string, selectedItems: Member[]) => {
    if (action === 'delete') {
      setShowBulkDeleteModal(true)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      const deletePromises = selectedMembers.map(member =>
        fetch(`http://localhost:3001/api/members/admin/${member.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      )

      const results = await Promise.allSettled(deletePromises)
      const successCount = results.filter(result => result.status === 'fulfilled').length
      const failCount = results.length - successCount

      if (successCount > 0) {
        showNotification('success', '다중 삭제 완료', `${successCount}명의 멤버가 삭제되었습니다.${failCount > 0 ? ` (${failCount}명 실패)` : ''}`)
        setSelectedMembers([])
        fetchMembers()
      } else {
        showNotification('error', '삭제 실패', '선택된 멤버 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('다중 삭제 실패:', error)
      showNotification('error', '오류 발생', '다중 삭제 중 오류가 발생했습니다.')
    } finally {
      setShowBulkDeleteModal(false)
    }
  }

  const closeBulkDeleteModal = () => {
    setShowBulkDeleteModal(false)
  }

  // 멤버 데이터를 평면화하여 정렬 가능하도록 변환
  const flattenedMembers = members.map(member => ({
    ...member,
    displayName: member.profile?.displayName || member.name,
    studentId: member.profile?.studentId || '',
    department: member.profile?.department || '',
    generation: member.profile?.generation || 0,
    position: member.profile?.position || '',
    bio: member.profile?.bio || '',
    isPublic: member.profile?.isPublic ?? true
  }))

  // 테이블 컬럼 정의
  const tableColumns = [
    {
      key: 'displayName',
      label: '멤버',
      sortable: true,
      width: '200px',
      render: (member: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">
              {member.displayName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {member.displayName}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: '이메일',
      sortable: true
    },
    {
      key: 'studentId',
      label: '학번',
      sortable: true,
      render: (member: any) => (
        <div className="text-sm text-gray-300">
          {member.studentId || '-'}
        </div>
      )
    },
    {
      key: 'department',
      label: '학과',
      sortable: true,
      render: (member: any) => (
        <div className="text-sm text-gray-300">
          {member.department || '-'}
        </div>
      )
    },
    {
      key: 'generation',
      label: '기수',
      sortable: true,
      render: (member: any) => (
        <div className="text-sm text-gray-300">
          {member.generation ? `${member.generation}기` : '-'}
        </div>
      )
    },
    {
      key: 'position',
      label: '직책',
      sortable: true,
      render: (member: any) => (
        <div className="text-sm text-gray-300">
          {member.position || '-'}
        </div>
      )
    },
    {
      key: 'role',
      label: '권한',
      sortable: true,
      render: (member: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          member.role === 'admin' 
            ? 'bg-pink-600 text-white' 
            : 'bg-gray-600 text-gray-300'
        }`}>
          {member.role === 'admin' ? '관리자' : '일반 멤버'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: '가입일',
      sortable: true,
      render: (member: any) => (
        <div className="text-sm text-gray-300">
          {new Date(member.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      label: '작업',
      render: (member: Member) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(member)}
            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-600 rounded-lg transition-colors"
            title="수정"
          >
            ✏️
          </button>
          <button
            onClick={() => openDeleteModal(member)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
            title="삭제"
          >
            🗑️
          </button>
        </div>
      )
    }
  ]

  const bulkActions = [
    {
      key: 'delete',
      label: '선택 삭제',
      icon: '🗑️',
      variant: 'danger' as const
    }
  ]

  const viewOptions = [
    { key: 'card', label: '카드', icon: '📋' },
    { key: 'list', label: '리스트', icon: '📝' }
  ]


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
        <div className="flex gap-3">
          <ViewToggle
            currentView={viewMode}
            views={viewOptions}
            onViewChange={(view) => setViewMode(view as 'card' | 'list')}
          />
          
          <Button onClick={openCsvModal} variant="secondary">
            📄 .csv로 추가
          </Button>
          <Button onClick={openAddModal} variant="primary">
          + 새 멤버 추가
          </Button>
        </div>
      </div>

      {/* 멤버 목록 */}
      {viewMode === 'card' ? (
        <CardGrid
          data={members}
          keyField="id"
          renderCard={(member) => (
            <MemberCard
              member={member}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          )}
          emptyMessage="등록된 멤버가 없습니다."
          columns={{
            default: 1,
            md: 2,
            lg: 3
          }}
        />
      ) : (
            <DataTable
              data={flattenedMembers}
              columns={tableColumns}
              keyField="id"
              selectable={true}
              onSelectionChange={handleSelectionChange}
              onBulkAction={handleBulkAction}
              bulkActions={bulkActions}
              emptyMessage="등록된 멤버가 없습니다."
            />
      )}

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
            <label className="block text-white font-medium mb-2">기수</label>
            <input
              type="number"
              value={formData.generation || ""}
              onChange={(e) => setFormData({...formData, generation: parseInt(e.target.value) || 0})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="기수를 입력하세요 (예: 1, 2, 3...)"
              min="0"
            />
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

      {/* CSV 업로드 모달 */}
      <Modal
        isOpen={showCsvModal}
        onClose={closeCsvModal}
        title="CSV로 멤버 추가"
        onSubmit={handleCsvUpload}
        submitText={csvUploading ? "업로드 중..." : "업로드"}
        cancelText="취소"
        submitDisabled={!csvFile || csvUploading}
      >
        <div className="space-y-6">
          {/* 안내 문구 */}
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <Title level={5} className="text-cyan-400 mb-2">
              📋 CSV 파일 형식
            </Title>
            <Text variant="secondary" size="sm" className="mb-3">
              다음 필드를 포함한 CSV 파일을 업로드하세요:
            </Text>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li><strong>필수:</strong> email, name</li>
              <li><strong>선택:</strong> displayName, studentId, position, department, year, generation, role, isPublic</li>
            </ul>
            <Text variant="muted" size="sm" className="mt-3">
              💡 초기 비밀번호는 이메일 주소의 @ 앞부분으로 자동 설정됩니다.
            </Text>
            <Text variant="muted" size="sm" className="mt-2">
              📝 엑셀에서 저장 시 "CSV UTF-8(쉼표로 분리)"을 권장합니다.
            </Text>
          </div>

          {/* 템플릿 다운로드 */}
          <div>
            <Button 
              onClick={downloadCsvTemplate} 
              variant="secondary"
              className="w-full"
            >
              📥 템플릿 다운로드
            </Button>
          </div>

          {/* 파일 선택 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              CSV 파일 선택
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvFileChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                       file:text-sm file:font-semibold file:bg-cyan-500 file:text-black
                       hover:file:bg-cyan-400 cursor-pointer"
            />
            {csvFile && (
              <div className="mt-2 p-3 bg-gray-700 border border-gray-600 rounded-lg">
                <Text variant="secondary" size="sm" className="font-semibold text-cyan-400">
                  ✓ 선택된 파일
                </Text>
                <Text variant="muted" size="sm" className="mt-1">
                  📄 {csvFile.name}
                </Text>
                <Text variant="muted" size="sm">
                  💾 {(csvFile.size / 1024).toFixed(2)} KB
                </Text>
              </div>
            )}
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2 mt-0.5">⚠️</span>
              <div>
                <Title level={6} className="text-yellow-400 mb-1">
                  주의사항
                </Title>
                <ul className="text-sm text-yellow-200/80 space-y-1 list-disc list-inside">
                  <li>중복된 이메일은 건너뜁니다</li>
                  <li>이메일은 @kookmin.ac.kr 도메인만 허용됩니다</li>
                  <li>업로드 후 콘솔에서 초기 비밀번호를 확인하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 다중 삭제 확인 모달 */}
      <Modal
        isOpen={showBulkDeleteModal}
        onClose={closeBulkDeleteModal}
        title="다중 삭제 확인"
        onSubmit={confirmBulkDelete}
        submitText="삭제"
        cancelText="취소"
        submitVariant="secondary"
      >
        <div className="space-y-4">
          <Text variant="secondary">
            선택된 {selectedMembers.length}명의 멤버를 삭제하시겠습니까?
          </Text>
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 max-h-40 overflow-y-auto">
            <Text variant="muted" size="sm" className="mb-2">
              삭제될 멤버:
            </Text>
            <ul className="space-y-1">
              {selectedMembers.map((member) => (
                <li key={member.id} className="text-sm text-gray-300">
                  • {member.profile?.displayName || member.name} ({member.email})
                </li>
              ))}
            </ul>
          </div>
          <Text variant="muted" size="sm" className="text-red-400">
            ⚠️ 이 작업은 되돌릴 수 없습니다.
          </Text>
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