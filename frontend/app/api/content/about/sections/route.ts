import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/api-config'


export async function GET(request: NextRequest) {
  try {
    console.log('Next.js API Route: 소개 섹션 조회')
    
    const backendUrl = `${BACKEND_URL}/api/content/about/sections`
    console.log('호출하는 백엔드 URL:', backendUrl)
    
    const response = await fetch(backendUrl, {
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
    console.log('소개 섹션:', data.length, '개')
    console.log('받은 데이터:', JSON.stringify(data, null, 2))
    
    const nextResponse = NextResponse.json(data)
    nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')
    return nextResponse
  } catch (error) {
    console.error('API Route 오류:', error)
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' }, 
      { status: 500 }
    )
  }
}
