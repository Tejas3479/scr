'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MissionData {
  date: string
  completed: number
}

export default function MissionOverview() {
  const [missionData, setMissionData] = useState<MissionData[]>([])

  useEffect(() => {
    // Fetch mission completion data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/missions/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setMissionData(data))
      .catch(err => console.error('Error fetching mission stats:', err))
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Completion Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={missionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            strokeWidth={2}
            name="Missions Completed"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


