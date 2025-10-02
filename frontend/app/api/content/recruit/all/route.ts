import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://aim-page-backend:3001'

export async function GET(request: NextRequest) {
  try {
    console.log('Next.js API Route: 모든 모집 공고 조회 시작')
    console.log('백엔드 URL:', BACKEND_URL)
    
    const response = await fetch(`${BACKEND_URL}/api/content/recruit/all-public`, {
      method: 'GET',
      headers: {
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
