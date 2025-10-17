'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('users').select('*')
      if (error) console.error(error)
      else setUsers(data)
    }
    fetchData()
  }, [])

  return (
    
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center">🚀 Supabase + Next.js + Tailwind</h1>
      <ul className="mt-4">
        {users.map((u) => (
          <li key={u.id} className="text-gray-600">{u.name}</li>
        ))}
      </ul>
    </div>
  )
}
