import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/api-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Next.js API Route: 모든 모집 공고 조회 시작 (관리자용)')
    console.log('백엔드 URL:', BACKEND_URL)
    
    // 관리자 인증 토큰 확인
    const token = request.headers.get('authorization')
    if (!token) {
      console.log('인증 토큰 없음 - 공개 API로 폴백')
      // 토큰이 없으면 공개 API 사용
      const response = await fetch(`${BACKEND_URL}/api/content/recruit/all-public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('백엔드 API 호출 실패:', response.status, response.statusText, errorText)
        return NextResponse.json(
          { error: `백엔드 API 호출 실패: ${response.status} ${response.statusText}` }, 
          { status: response.status }
        )
      }
      
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    // 토큰이 있으면 관리자 API 사용
    console.log('인증 토큰 있음 - 관리자 API 사용')
    const response = await fetch(`${BACKEND_URL}/api/content/recruit/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
    
    console.log('백엔드 응답 상태:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('백엔드 API 호출 실패:', response.status, response.statusText, errorText)
      return NextResponse.json(
        { error: `백엔드 API 호출 실패: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('백엔드에서 받은 데이터:', data.length, '개')
    console.log('데이터 샘플:', data[0] ? { id: data[0].id, title: data[0].title } : '없음')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route 오류:', error)
    return NextResponse.json(
      { error: `서버 내부 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` }, 
      { status: 500 }
    )
  }
}
