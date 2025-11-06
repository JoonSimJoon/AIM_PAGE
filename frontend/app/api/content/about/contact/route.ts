import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/api-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Next.js API Route: 연락처 조회')
    
    const response = await fetch(`${BACKEND_URL}/api/content/about/contact`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('백엔드 API 호출 실패:', response.status, response.statusText)
      return NextResponse.json(
        { error: '백엔드 API 호출 실패' }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('연락처:', data.length, '개')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route 오류:', error)
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' }, 
      { status: 500 }
    )
  }
}
