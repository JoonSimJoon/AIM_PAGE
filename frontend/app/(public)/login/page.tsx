'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { post } from '@/lib/api-client'
import { APP_NAME } from '@/lib/config'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    document.title = `Login - ${APP_NAME}`
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await post('/api/auth/login', { email, password })
      const data = await response.json()

      if (response.ok) {
        // Auth Context를 통해 로그인 처리
        login(data.token, data.user)
        
        alert(`로그인 성공! ${data.user.name}님 환영합니다.`)
        
        // 메인 페이지로 리다이렉트
        router.push('/')
      } else {
        alert(data.error || '로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      alert('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 로그인 안내 */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl">🔑</span>
            <p className="font-semibold">
              입부 시 작성한 국민대학교 이메일(@kookmin.ac.kr)로 로그인해주세요.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center text-2xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AIM
            </span>
            <span className="ml-2 text-gray-400">AI Monsters</span>
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-white">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            또는{' '}
            <Link href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
              새로운 계정 만들기
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-4 shadow-lg border border-gray-700 sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  이메일
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="your.email@kookmin.ac.kr"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  비밀번호
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-cyan-500 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
              </div>

              <div className="mt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-4">
                    로그인에 문제가 생길 시 운영진에게 문의 바랍니다.
                  </p>
                  <div className="flex justify-center">
                    <Link 
                      href="/recruit"
                      className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                    >
                      📋 모집 안내 보기
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}