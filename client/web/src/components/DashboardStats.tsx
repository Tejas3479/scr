'use client'

interface DashboardStatsProps {
  stats: {
    totalUsers: number
    activeUsers: number
    missionsCompleted: number
    totalPoints: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: '🟢',
      color: 'bg-green-500',
    },
    {
      title: 'Missions Completed',
      value: stats.missionsCompleted.toLocaleString(),
      icon: '✅',
      color: 'bg-purple-500',
    },
    {
      title: 'Total Points',
      value: stats.totalPoints.toLocaleString(),
      icon: '⭐',
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} rounded-full p-4`}>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


