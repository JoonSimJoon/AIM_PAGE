'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Text, Title, Subtitle, Loading } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { authGet, authPut } from '@/lib/api-client'
import { APP_NAME } from '@/lib/config'

interface ProfileData {
  displayName: string
  studentId: string
  position: string
  department: string
  year: string
  generation: number
  bio: string
  isPublic: boolean
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    studentId: '',
    position: '',
    department: '',
    year: '',
    generation: 0,
    bio: '',
    isPublic: true
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    hiding?: boolean
  }>({
    show: false,
    type: 'info',
    title: '',
    message: '',
    hiding: false
  })

  useEffect(() => {
    document.title = `프로필 - ${APP_NAME}`
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      alert('로그인이 필요합니다.')
      router.push('/login')
    } else if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated, isLoading, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await authGet('/api/members/me')
      
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          displayName: data.profile?.displayName || data.name || '',
          studentId: data.profile?.studentId || '',
          position: data.profile?.position || '',
          department: data.profile?.department || '',
          year: data.profile?.year || '',
          generation: data.profile?.generation || 0,
          bio: data.profile?.bio || '',
          isPublic: data.profile?.isPublic ?? true
        })
      } else {
        showNotification('error', '로드 실패', '프로필 정보를 불러오지 못했습니다.')
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error)
      showNotification('error', '오류', '프로필 정보를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string
  ) => {
    setNotification({
      show: true,
      type,
      title,
      message,
      hiding: false
    })
    
    setTimeout(() => {
      hideNotification()
    }, 3000)
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, hiding: true }))
    setTimeout(() => {
      setNotification({
        show: false,
        type: 'info',
        title: '',
        message: '',
        hiding: false
      })
    }, 300)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      const response = await authPut('/api/members/me', profileData)
      
      if (response.ok) {
        showNotification('success', '저장 완료', '프로필이 성공적으로 업데이트되었습니다.')
      } else {
        const error = await response.json()
        showNotification('error', '저장 실패', error.error || '프로필 업데이트에 실패했습니다.')
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error)
      showNotification('error', '오류', '프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', '비밀번호 불일치', '새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      showNotification('error', '비밀번호 오류', '비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    try {
      setSaving(true)
      const response = await authPut('/api/members/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (response.ok) {
        showNotification('success', '변경 완료', '비밀번호가 성공적으로 변경되었습니다.')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const error = await response.json()
        showNotification('error', '변경 실패', error.error || '비밀번호 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error)
      showNotification('error', '오류', '비밀번호 변경 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loading text="프로필을 불러오는 중..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <Title level={1} className="text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              프로필 관리
            </span>
          </Title>
          <Subtitle className="text-gray-400">
            내 프로필 정보를 관리하고 비밀번호를 변경할 수 있습니다
          </Subtitle>
        </div>

        {/* 탭 */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            프로필 정보
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'password'
                ? 'bg-cyan-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            비밀번호 변경
          </button>
        </div>

        {/* 프로필 정보 탭 */}
        {activeTab === 'profile' && (
          <Card className="p-8">
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    표시 이름 *
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="표시될 이름을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    학번
                  </label>
                  <input
                    type="text"
                    value={profileData.studentId}
                    onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="20241234"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    직책
                  </label>
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="부원, 운영진 등"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    학과
                  </label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="소프트웨어학부 등"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    학년
                  </label>
                  <input
                    type="text"
                    value={profileData.year}
                    onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="1학년, 2학년 등"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    기수
                  </label>
                  <input
                    type="number"
                    value={profileData.generation || ''}
                    onChange={(e) => setProfileData({ ...profileData, generation: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="1, 2, 3..."
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">
                    자기소개
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    rows={4}
                    placeholder="자기소개를 입력하세요"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.isPublic}
                      onChange={(e) => setProfileData({ ...profileData, isPublic: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className="text-white font-medium">
                      프로필 공개 (부원 페이지에 표시)
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? '저장 중...' : '저장'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* 비밀번호 변경 탭 */}
        {activeTab === 'password' && (
          <Card className="p-8">
            <form onSubmit={handlePasswordSubmit}>
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    현재 비밀번호 *
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="현재 비밀번호"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    새 비밀번호 *
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="새 비밀번호 (최소 6자)"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    새 비밀번호 확인 *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="새 비밀번호 확인"
                    required
                    minLength={6}
                  />
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      비밀번호가 일치하지 않습니다.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving || passwordData.newPassword !== passwordData.confirmPassword}
                >
                  {saving ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>

      {/* 알림 */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`${
              notification.hiding ? 'animate-slide-out-right' : 'animate-slide-in-right'
            } bg-gray-800 border-l-4 ${
              notification.type === 'success'
                ? 'border-green-500'
                : notification.type === 'error'
                ? 'border-red-500'
                : notification.type === 'warning'
                ? 'border-yellow-500'
                : 'border-cyan-500'
            } rounded-lg shadow-xl p-4 min-w-[320px] max-w-md`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <Title level={4} className="text-white text-sm font-medium">
                  {notification.title}
                </Title>
                {notification.message && (
                  <Text className="text-gray-300 text-sm mt-1">
                    {notification.message}
                  </Text>
                )}
              </div>
              <button
                onClick={hideNotification}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {!notification.hiding && (
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 animate-progress" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

