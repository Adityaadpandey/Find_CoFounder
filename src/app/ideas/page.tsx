'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { IdeaCard } from '@/components/idea-card'
import { SearchFilter } from '@/components/search-filter'

interface Idea {
  id: string
  title: string
  description: string
  equity: number
  skills: string[]
  userId: string
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas')
      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
        setFilteredIdeas(data)
      } else {
        console.error('Failed to fetch ideas')
      }
    } catch (error) {
      console.error('Error fetching ideas:', error)
    }
  }

  const handleFilter = (filters: { search: string; skill: string }) => {
    const filtered = ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        idea.description.toLowerCase().includes(filters.search.toLowerCase())
      const matchesSkill = filters.skill ? idea.skills.includes(filters.skill) : true
      return matchesSearch && matchesSkill
    })
    setFilteredIdeas(filtered)
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Startup Ideas</h1>
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <aside>
            <SearchFilter onFilter={handleFilter} />
          </aside>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} {...idea} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

