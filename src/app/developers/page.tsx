'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchFilter } from '@/components/search-filter'

// This is mock data. In a real application, this would come from an API or database.
const mockDevelopers = [
  {
    id: '1',
    name: 'Alice Johnson',
    title: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'Python'],
    bio: 'Passionate about building scalable web applications and exploring new technologies.',
  },
  {
    id: '2',
    name: 'Bob Smith',
    title: 'Mobile App Developer',
    skills: ['React Native', 'iOS', 'Android'],
    bio: 'Experienced in creating cross-platform mobile apps with a focus on user experience.',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    title: 'AI/ML Engineer',
    skills: ['Python', 'TensorFlow', 'PyTorch'],
    bio: 'Specializing in machine learning models and their practical applications in business.',
  },
]

export default function DevelopersPage() {
  const [filteredDevelopers, setFilteredDevelopers] = useState(mockDevelopers)

  const handleFilter = (filters: { search: string; skill: string }) => {
    const filtered = mockDevelopers.filter((dev) => {
      const matchesSearch =
        dev.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        dev.bio.toLowerCase().includes(filters.search.toLowerCase())
      const matchesSkill = filters.skill ? dev.skills.includes(filters.skill) : true
      return matchesSearch && matchesSkill
    })
    setFilteredDevelopers(filtered)
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Find Developers</h1>
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <aside>
            <SearchFilter onFilter={handleFilter} />
          </aside>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDevelopers.map((dev) => (
              <Card key={dev.id}>
                <CardHeader>
                  <CardTitle>{dev.name}</CardTitle>
                  <p className="text-sm text-gray-500">{dev.title}</p>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">{dev.bio}</p>
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="mt-4 w-full">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

