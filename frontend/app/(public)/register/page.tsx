'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    major: '',
    grade: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // 페이지 제목 설정
  useEffect(() => {
    document.title = 'Register - AIM: AI Monsters'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`회원가입 성공! ${data.user.name}님 환영합니다.`)
        window.location.href = '/login'
      } else {
        alert(data.error || '회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      alert('회원가입 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 회원가입 제한 안내 */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl">⚠️</span>
            <p className="font-semibold">
              일반 회원가입은 현재 제한되어 있습니다. 
              <span className="ml-1">입부 시 작성한 국민대학교 이메일로 로그인해주세요.</span>
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
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
              로그인하기
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-4 shadow-lg border border-gray-700 sm:rounded-lg sm:px-10">
            {/* 회원가입 제한 안내 카드 */}
            <div className="text-center mb-8">
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl">🚫</span>
                </div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  회원가입이 제한되었습니다
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  일반 회원가입은 현재 받지 않고 있습니다.<br />
                  <span className="text-cyan-400 font-medium">입부 시 작성한 국민대학교 이메일</span>로 로그인해주세요.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/login"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-md font-semibold transition-colors text-center"
                >
                  로그인하기
                </Link>
                <Link 
                  href="/recruit"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-semibold transition-colors text-center"
                >
                  모집 안내 보기
                </Link>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-sm text-gray-400 text-center mb-3">
                  회원가입 관련 문의사항이 있으시면 운영진에게 문의 바랍니다.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="mailto:aim@kookmin.ac.kr"
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                  >
                    📧 운영진에게 문의하기
                  </a>
                </div>
              </div>
            </div>

            {/* 기존 폼 (비활성화) */}
            <div className="opacity-50 pointer-events-none">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white">
                    이름
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    이메일 주소
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
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
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                    비밀번호 확인
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-white">
                    학번
                  </label>
                  <div className="mt-1">
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      required
                      value={formData.studentId}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="major" className="block text-sm font-medium text-white">
                    전공
                  </label>
                  <div className="mt-1">
                    <select
                      id="major"
                      name="major"
                      required
                      value={formData.major}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
                    >
                      <option value="">전공을 선택하세요</option>
                      <option value="컴퓨터공학부">컴퓨터공학부</option>
                      <option value="소프트웨어학부">소프트웨어학부</option>
                      <option value="전자공학부">전자공학부</option>
                      <option value="기계공학부">기계공학부</option>
                      <option value="경영학부">경영학부</option>
                      <option value="경제학부">경제학부</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-white">
                    학년
                  </label>
                  <div className="mt-1">
                    <select
                      id="grade"
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
                    >
                      <option value="">학년을 선택하세요</option>
                      <option value="1학년">1학년</option>
                      <option value="2학년">2학년</option>
                      <option value="3학년">3학년</option>
                      <option value="4학년">4학년</option>
                      <option value="대학원생">대학원생</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white">
                    전화번호
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-cyan-500 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                  >
                    {isLoading ? '회원가입 중...' : '회원가입'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}