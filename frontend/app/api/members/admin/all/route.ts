import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/api-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Next.js API Route: 모든 멤버 조회 시작')
    console.log('백엔드 URL:', BACKEND_URL)
    
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json({ error: '인증 토큰이 필요합니다.' }, { status: 401 })
    }
    
    const response = await fetch(`${BACKEND_URL}/api/members/admin/all`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
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
    console.log('백엔드에서 받은 멤버 데이터:', data.length, '개')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route 오류:', error)
    return NextResponse.json(
      { error: `서버 내부 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` }, 
      { status: 500 }
    )
  }
}
