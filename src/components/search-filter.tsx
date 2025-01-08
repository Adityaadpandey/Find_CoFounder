import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SearchFilter({ onFilter }: { onFilter: (filters: any) => void }) {
  const [search, setSearch] = useState('')
  const [skill, setSkill] = useState('')

  const handleFilter = () => {
    onFilter({ search, skill })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Search Ideas</Label>
        <Input
          id="search"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="skill">Filter by Skill</Label>
        <Select value={skill} onValueChange={setSkill}>
          <SelectTrigger id="skill">
            <SelectValue placeholder="Select a skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="node">Node.js</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="design">UI/UX Design</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleFilter} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}

