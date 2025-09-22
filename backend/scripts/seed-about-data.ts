import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAboutData() {
  try {
    console.log('소개 페이지 기본 데이터 생성 시작...')

    // 1. 소개 섹션 데이터
    const introSection = await prisma.aboutSection.upsert({
      where: { id: 'intro-section-1' },
      update: {},
      create: {
        id: 'intro-section-1',
        type: 'intro',
        title: '우리는 누구인가',
        content: `AIM(AI Monsters)는 인공지능과 머신러닝 분야에 
관심있는 학생들이 모여 함께 학습하고 성장하는 커뮤니티입니다.

이론적 학습부터 실무 프로젝트까지, 다양한 활동을 통해 AI 분야의 전문가로 성장할 수 있도록 
서로 돕고 격려하는 환경을 만들어가고 있습니다.`,
        order: 1,
        isActive: true
      }
    })

    // 2. 주요 활동 데이터
    const activities = [
      {
        id: 'activity-1',
        title: '정기 스터디',
        description: '매주 정기적으로 AI/ML 관련 주제를 선정하여 스터디를 진행합니다.\n개별 학습 내용을 발표하고 토론하는 시간을 가집니다.',
        icon: '📚',
        color: 'cyan',
        order: 1
      },
      {
        id: 'activity-2',
        title: '팀 프로젝트',
        description: '실무에 적용 가능한 AI 프로젝트를 팀 단위로 진행하여 \n포트폴리오를 구축하고 실무 경험을 쌓습니다.',
        icon: '🚀',
        color: 'pink',
        order: 2
      },
      {
        id: 'activity-3',
        title: '세미나 & 워크샵',
        description: '외부 전문가 초청 세미나와 최신 기술 트렌드를 공유하는 \n워크샵을 정기적으로 개최합니다.',
        icon: '🎤',
        color: 'yellow',
        order: 3
      },
      {
        id: 'activity-4',
        title: '대회 참가',
        description: 'AI/ML 관련 대회에 팀 단위로 참가하여 실력을 검증하고 \n수상 경력을 쌓아갑니다.',
        icon: '🏆',
        color: 'purple',
        order: 4
      }
    ]

    for (const activity of activities) {
      await prisma.aboutActivity.upsert({
        where: { id: activity.id },
        update: {},
        create: {
          ...activity,
          isActive: true
        }
      })
    }

    // 3. 동아리 연혁 데이터
    const historyItems = [
      {
        id: 'history-1',
        year: 2024,
        title: 'AIM 동아리 웹사이트 구축',
        description: '부원들의 학습 내용과 프로젝트를 공유할 수 있는 플랫폼 구축',
        order: 1
      },
      {
        id: 'history-2',
        year: 2023,
        title: '첫 번째 AI 해커톤 개최',
        description: '동아리 주관으로 AI 주제의 해커톤을 개최하여 많은 참가자들이 모였습니다',
        order: 2
      },
      {
        id: 'history-3',
        year: 2022,
        title: 'AIM 동아리 설립',
        description: 'AI와 머신러닝에 관심있는 학생들이 모여 동아리를 설립했습니다',
        order: 3
      }
    ]

    for (const history of historyItems) {
      await prisma.aboutHistory.upsert({
        where: { id: history.id },
        update: {},
        create: {
          ...history,
          isActive: true
        }
      })
    }

    // 4. 연락처 데이터
    const contacts = [
      {
        id: 'contact-1',
        type: 'email',
        label: 'Email',
        value: 'aim.club@kookmin.ac.kr',
        order: 1
      },
      {
        id: 'contact-2',
        type: 'github',
        label: 'GitHub',
        value: 'github.com/aim-monsters',
        order: 2
      },
      {
        id: 'contact-3',
        type: 'instagram',
        label: 'Instagram',
        value: '@aim_monsters_official',
        order: 3
      }
    ]

    for (const contact of contacts) {
      await prisma.aboutContact.upsert({
        where: { id: contact.id },
        update: {},
        create: {
          ...contact,
          isActive: true
        }
      })
    }

    console.log('✅ 소개 페이지 기본 데이터 생성 완료!')
    console.log(`- 소개 섹션: 1개`)
    console.log(`- 주요 활동: ${activities.length}개`)
    console.log(`- 동아리 연혁: ${historyItems.length}개`)
    console.log(`- 연락처: ${contacts.length}개`)

  } catch (error) {
    console.error('❌ 기본 데이터 생성 오류:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 스크립트 실행
if (require.main === module) {
  seedAboutData()
    .then(() => {
      console.log('🎉 기본 데이터 생성이 완료되었습니다!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 오류 발생:', error)
      process.exit(1)
    })
}

export default seedAboutData
