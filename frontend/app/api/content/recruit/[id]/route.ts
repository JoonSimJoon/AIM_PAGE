import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://aim-page-backend:3001'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Next.js API Route: 모집 공고 수정')
    console.log('모집 공고 ID:', params.id)
    
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('수정 데이터:', body)
    
    const response = await fetch(`${BACKEND_URL}/api/content/recruit/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      console.error('백엔드 API 호출 실패:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('백엔드 오류 응답:', errorData)
      return NextResponse.json(
        { error: '백엔드 API 호출 실패' }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('모집 공고 수정 완료:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route 오류:', error)
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Next.js API Route: 모집 공고 삭제')
    console.log('모집 공고 ID:', params.id)
    
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' }, 
        { status: 401 }
      )
    }
    
    const response = await fetch(`${BACKEND_URL}/api/content/recruit/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
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
    console.log('모집 공고 삭제 완료:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route 오류:', error)
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' }, 
      { status: 500 }
    )
  }
}
