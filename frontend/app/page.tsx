export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          동아리 웹사이트에 오신 것을 환영합니다
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          동아리 활동과 스터디를 공유하는 공간입니다
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">동아리 소개</h2>
            <p className="text-gray-600">
              우리 동아리의 역사와 활동을 확인해보세요
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">스터디 활동</h2>
            <p className="text-gray-600">
              부원들의 스터디 글과 학습 내용을 공유합니다
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">활동 기록</h2>
            <p className="text-gray-600">
              동아리의 다양한 활동과 수상 경력을 확인하세요
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
