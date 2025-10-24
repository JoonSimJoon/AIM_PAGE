'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 사용자 인터페이스
 */
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
}

/**
 * Auth Context 타입
 */
interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Provider 컴포넌트
 * 전역 인증 상태를 관리합니다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 초기 로드 시 localStorage에서 인증 정보 복원
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      // 에러 발생 시 localStorage 정리
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 로그인 처리
   */
  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  /**
   * 로그아웃 처리
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    router.push('/')
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Auth Context Hook
 * 컴포넌트에서 인증 상태를 사용하기 위한 Hook
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

