import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-gray-900'
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              AIM 동아리
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about" className={isActive('/about')}>
              소개
            </Link>
            <Link href="/members" className={isActive('/members')}>
              부원
            </Link>
            <Link href="/activities" className={isActive('/activities')}>
              활동
            </Link>
            <Link href="/studies" className={isActive('/studies')}>
              스터디
            </Link>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
