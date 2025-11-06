import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/api-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Next.js API Route: 지난 모집 공고 조회')
    
    const response = await fetch(`${BACKEND_URL}/api/content/recruit/past`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // 캐시 비활성화
    })
    
    if (!response.ok) {
      console.error('백엔드 API 호출 실패:', response.status, response.statusText)
      return NextResponse.json(
        { error: '백엔드 API 호출 실패' }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('지난 모집 공고:', data.length, '개')
    
    // 캐시 방지 헤더 추가
    const responseHeaders = new Headers()
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    responseHeaders.set('Pragma', 'no-cache')
    responseHeaders.set('Expires', '0')
    
    return NextResponse.json(data, { headers: responseHeaders })
  } catch (error) {
    console.error('API Route 오류:', error)
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' }, 
      { status: 500 }
    )
  }
}
