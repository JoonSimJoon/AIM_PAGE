'use client'

import { Card } from '@/components/ui/Card'
import { Title, Text } from '@/components/ui/Text'

interface Member {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  profile: {
    id: string
    displayName: string
    studentId?: string
    position?: string
    department?: string
    year?: string
    generation?: number
    bio?: string
    isPublic: boolean
  } | null
}

interface MemberCardProps {
  member: Member
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  className?: string
}

export function MemberCard({ member, onEdit, onDelete, className = '' }: MemberCardProps) {
  return (
    <Card className={`hover:border-cyan-500 transition-all ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">
            {(member.profile?.displayName || member.name).charAt(0)}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(member)}
            className="text-cyan-400 hover:text-cyan-300 text-sm px-2 py-1 bg-gray-700 rounded border border-gray-600 hover:border-cyan-500 transition-colors"
          >
            ✏️ 편집
          </button>
          <button
            onClick={() => onDelete(member)}
            className="text-red-400 hover:text-red-300 text-sm px-2 py-1 bg-gray-700 rounded border border-gray-600 hover:border-red-500 transition-colors"
          >
            🗑️ 삭제
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Title level={3} className="text-white">
          {member.profile?.displayName || member.name}
        </Title>
        <Text variant="secondary" size="sm">
          {member.email}
        </Text>
        {member.profile?.studentId && (
          <Text variant="muted" size="sm">
            학번: {member.profile.studentId}
          </Text>
        )}
        {member.profile?.department && (
          <Text variant="muted" size="sm">
            {member.profile.department}
          </Text>
        )}
        {member.profile?.generation && (
          <Text variant="muted" size="sm" className="font-semibold text-pink-400">
            {member.profile.generation}기
          </Text>
        )}
        {member.profile?.year && (
          <Text variant="muted" size="sm">
            {member.profile.year}
          </Text>
        )}
        {member.profile?.position && (
          <Text variant="muted" size="sm">
            {member.profile.position}
          </Text>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            member.role === 'admin' 
              ? 'bg-pink-600 text-white' 
              : 'bg-gray-600 text-gray-300'
          }`}>
            {member.role === 'admin' ? '관리자' : '일반 멤버'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(member.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  )
}
