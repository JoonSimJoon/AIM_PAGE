'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, Card, Text, Title, Subtitle, Loading, Modal } from '@/components/ui'

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

export default function RecruitManagementPage() {
  const [notices, setNotices] = useState<RecruitNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNotice, setEditingNotice] = useState<RecruitNotice | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    bodyMd: '',
    startAt: '',
    endAt: '',
    isOpen: true,
    externalFormUrl: '',
    targetAudience: '',
    recruitCount: '',
    recruitMethod: '',
    shortDescription: ''
  })
  const [initialFormData, setInitialFormData] = useState(formData)
  const [hasChanges, setHasChanges] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    confirmText?: string
    onConfirm?: () => void
  }>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  })

  useEffect(() => {
    document.title = '모집 공고 관리 - AIM: AI Monsters'
  }, [])

  useEffect(() => {
    fetchNotices()
  }, [])

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(initialFormData))
  }, [formData, initialFormData])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      console.log('fetchNotices 시작')
      
      const response = await fetch('/api/content/recruit/all')
      console.log('API 요청 완료, 응답 상태:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('받은 데이터:', data)
        console.log('데이터 타입:', typeof data, '배열인가?', Array.isArray(data))
        setNotices(data)
        console.log('상태 업데이트 완료')
      } else {
        const errorText = await response.text()
        console.error('API 오류:', response.status, response.statusText, errorText)
        showNotification({
          show: true,
          type: 'error',
          title: '로딩 실패',
          message: `모집 공고 목록을 불러오는데 실패했습니다. (${response.status}: ${response.statusText})`
        })
      }
    } catch (error) {
      console.error('네트워크 오류:', error)
      showNotification({
        show: true,
        type: 'error',
        title: '오류',
        message: '데이터를 불러오는 중 오류가 발생했습니다.'
      })
    } finally {
      setLoading(false)
      console.log('fetchNotices 완료')
    }
  }

  const openAddModal = () => {
    setEditingNotice(null)
    setFormData({
      title: '',
      bodyMd: '',
      startAt: '',
      endAt: '',
      isOpen: true,
      externalFormUrl: '',
      targetAudience: '',
      recruitCount: '',
      recruitMethod: '',
      shortDescription: ''
    })
    setInitialFormData({
      title: '',
      bodyMd: '',
      startAt: '',
      endAt: '',
      isOpen: true,
      externalFormUrl: '',
      targetAudience: '',
      recruitCount: '',
      recruitMethod: '',
      shortDescription: ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    if (hasChanges) {
      setShowConfirmDialog(true)
    } else {
      setShowModal(false)
      setEditingNotice(null)
      setFormData({
        title: '',
        bodyMd: '',
        startAt: '',
        endAt: '',
        isOpen: true,
        externalFormUrl: '',
        targetAudience: '',
        recruitCount: '',
        recruitMethod: '',
        shortDescription: ''
      })
      setInitialFormData({
        title: '',
        bodyMd: '',
        startAt: '',
        endAt: '',
        isOpen: true,
        externalFormUrl: '',
        targetAudience: '',
        recruitCount: '',
        recruitMethod: '',
        shortDescription: ''
      })
    }
  }

  const saveAndClose = async () => {
    await handleSubmit()
    setShowConfirmDialog(false)
  }

  const cancelClose = () => {
    setShowConfirmDialog(false)
  }

  const confirmClose = () => {
    setShowModal(false)
    setEditingNotice(null)
    setFormData({
      title: '',
      bodyMd: '',
      startAt: '',
      endAt: '',
      isOpen: true,
      externalFormUrl: '',
      targetAudience: '',
      recruitCount: '',
      recruitMethod: '',
      shortDescription: ''
    })
    setInitialFormData({
      title: '',
      bodyMd: '',
      startAt: '',
      endAt: '',
      isOpen: true,
      externalFormUrl: '',
      targetAudience: '',
      recruitCount: '',
      recruitMethod: '',
      shortDescription: ''
    })
    setShowConfirmDialog(false)
  }

  const handleEdit = (notice: RecruitNotice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      bodyMd: notice.bodyMd,
      startAt: notice.startAt.split('T')[0],
      endAt: notice.endAt.split('T')[0],
      isOpen: notice.isOpen,
      externalFormUrl: notice.externalFormUrl || '',
      targetAudience: notice.targetAudience || '',
      recruitCount: notice.recruitCount || '',
      recruitMethod: notice.recruitMethod || '',
      shortDescription: notice.shortDescription || ''
    })
    setInitialFormData({
      title: notice.title,
      bodyMd: notice.bodyMd,
      startAt: notice.startAt.split('T')[0],
      endAt: notice.endAt.split('T')[0],
      isOpen: notice.isOpen,
      externalFormUrl: notice.externalFormUrl || '',
      targetAudience: notice.targetAudience || '',
      recruitCount: notice.recruitCount || '',
      recruitMethod: notice.recruitMethod || '',
      shortDescription: notice.shortDescription || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    showNotification({
      show: true,
      type: 'warning',
      title: '삭제 확인',
      message: '정말로 이 모집 공고를 삭제하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/content/recruit/${id}`, {
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
              message: '모집 공고가 성공적으로 삭제되었습니다.'
            })
            fetchNotices()
          } else {
            showNotification({
              show: true,
              type: 'error',
              title: '삭제 실패',
              message: '모집 공고 삭제에 실패했습니다.'
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
    })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    try {
      const url = editingNotice 
        ? `/api/content/recruit/${editingNotice.id}`
        : '/api/content/recruit'
      
      const method = editingNotice ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          startAt: new Date(formData.startAt).toISOString(),
          endAt: new Date(formData.endAt).toISOString()
        })
      })
      
      if (response.ok) {
        showNotification({
          show: true,
          type: 'success',
          title: editingNotice ? '수정 완료' : '생성 완료',
          message: `모집 공고가 성공적으로 ${editingNotice ? '수정' : '생성'}되었습니다.`
        })
        setShowModal(false)
        setEditingNotice(null)
        setFormData({
          title: '',
          bodyMd: '',
          startAt: '',
          endAt: '',
          isOpen: true,
          externalFormUrl: '',
          targetAudience: '',
          recruitCount: '',
          recruitMethod: '',
          shortDescription: ''
        })
        setInitialFormData({
          title: '',
          bodyMd: '',
          startAt: '',
          endAt: '',
          isOpen: true,
          externalFormUrl: '',
          targetAudience: '',
          recruitCount: '',
          recruitMethod: '',
          shortDescription: ''
        })
        fetchNotices()
      } else {
        showNotification({
          show: true,
          type: 'error',
          title: editingNotice ? '수정 실패' : '생성 실패',
          message: `모집 공고 ${editingNotice ? '수정' : '생성'}에 실패했습니다.`
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

  const loadTemplate = () => {
    const template = `# 모집 개요

## 모집 대상
국민대학교 재학생 (전 학과/학년)

## 모집 인원
15명 내외

## 모집 방법
서류 + 면접

## 주요 활동
- 정기 스터디
- 팀 프로젝트
- 세미나 & 워크샵
- 대회 참가

## 지원 방법
1. 지원서 작성
2. 서류 심사
3. 면접
4. 최종 발표

## 연락처
- 이메일: aim@kookmin.ac.kr
- 카카오톡: AIM 공식 채널`
    
    setFormData(prev => ({ ...prev, bodyMd: template }))
  }

  const showNotification = (notification: {
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    confirmText?: string
    onConfirm?: () => void
  }) => {
    setNotification(notification)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading text="모집 공고를 불러오는 중..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 */}
      <div className="mb-8">
        <Title level={1} className="text-white mb-2">모집 공고 관리</Title>
        <Subtitle className="text-gray-400">
          모집 공고를 작성하고 관리할 수 있습니다.
        </Subtitle>
      </div>

      {/* 추가 버튼 */}
      <div className="mb-6">
        <Button onClick={openAddModal} variant="primary">
          + 새 모집 공고 작성
        </Button>
      </div>

      {/* 모집 공고 목록 */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <Card className="text-center py-12">
            <Text variant="secondary" size="lg">
              아직 등록된 모집 공고가 없습니다.
            </Text>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Title level={3} className="text-white">
                      {notice.title}
                    </Title>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      notice.isOpen 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {notice.isOpen ? '진행중' : '마감'}
                    </span>
                  </div>
                  <Text variant="secondary" className="mb-2">
                    {notice.shortDescription || '설명이 없습니다.'}
                  </Text>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>시작: {new Date(notice.startAt).toLocaleDateString()}</span>
                    <span>종료: {new Date(notice.endAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(notice)} variant="ghost" size="sm">
                    수정
                  </Button>
                  <Button onClick={() => handleDelete(notice.id)} variant="ghost" size="sm">
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
        title={editingNotice ? `모집 공고 수정: ${editingNotice.title}` : '새 모집 공고 작성'}
        onSubmit={handleSubmit}
        submitText={editingNotice ? '수정' : '생성'}
        maxWidth="4xl"
      >
        <div>
          <label className="block text-white font-medium mb-2">제목 *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="모집 공고 제목을 입력하세요"
            required
          />
        </div>

        {/* 카드 표시용 필드들 */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-black font-bold text-sm">📋</span>
            </span>
            카드 표시 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">모집 대상</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="예: 국민대학교 재학생 (전 학과/학년)"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">모집 인원</label>
              <input
                type="text"
                value={formData.recruitCount}
                onChange={(e) => setFormData({...formData, recruitCount: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="예: 15명 내외"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">모집 방법</label>
              <input
                type="text"
                value={formData.recruitMethod}
                onChange={(e) => setFormData({...formData, recruitMethod: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="예: 서류 + 면접"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">짧은 설명</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="카드에 표시될 짧은 설명"
              />
            </div>
          </div>
        </div>

        {/* 마크다운 에디터 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-white font-medium">상세 내용 (Markdown) *</label>
              <Button type="button" onClick={loadTemplate} variant="ghost" size="sm">
                템플릿 로드
              </Button>
            </div>
            <textarea
              value={formData.bodyMd}
              onChange={(e) => setFormData({...formData, bodyMd: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-96 resize-none"
              placeholder="Markdown 형식으로 모집 공고 내용을 작성하세요..."
              required
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">미리보기</label>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 h-96 overflow-y-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {formData.bodyMd || '*내용을 입력하면 여기에 미리보기가 표시됩니다.*'}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* 날짜 및 설정 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">모집 시작일 *</label>
            <input
              type="date"
              value={formData.startAt}
              onChange={(e) => setFormData({...formData, startAt: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">모집 마감일 *</label>
            <input
              type="date"
              value={formData.endAt}
              onChange={(e) => setFormData({...formData, endAt: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* 외부 폼 URL */}
        <div>
          <label className="block text-white font-medium mb-2">외부 지원 폼 URL (선택사항)</label>
          <input
            type="url"
            value={formData.externalFormUrl}
            onChange={(e) => setFormData({...formData, externalFormUrl: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="https://forms.google.com/..."
          />
        </div>

        {/* 모집 공개 설정 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isOpen"
            checked={formData.isOpen}
            onChange={(e) => setFormData({...formData, isOpen: e.target.checked})}
            className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
          />
          <label htmlFor="isOpen" className="text-white font-medium">
            모집 공개 (체크 해제 시 모집이 마감됩니다)
          </label>
        </div>
      </Modal>

      {/* 확인 대화상자 */}
      {showConfirmDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              변경사항이 저장되지 않았습니다
            </h3>
            <p className="text-gray-300 mb-6">
              작성하신 내용에 변경사항이 있습니다. 어떻게 하시겠습니까?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={saveAndClose}
                className="w-full px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                저장하고 닫기
              </button>
              <button
                onClick={cancelClose}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                계속하기
              </button>
              <button
                onClick={confirmClose}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                저장하지 않고 닫기
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
            <p className="text-gray-300 mb-6">
              {notification.message}
            </p>
            <div className="flex justify-end space-x-3">
              {notification.onConfirm && (
                <button
                  onClick={handleNotificationConfirm}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                >
                  {notification.confirmText}
                </button>
              )}
              <button
                onClick={hideNotification}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                {notification.onConfirm ? '취소' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
