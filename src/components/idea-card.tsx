import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface IdeaCardProps {
  id: string
  title: string
  description: string
  skills: string[]
  equity: number
}

export function IdeaCard({ id, title, description, skills, equity }: IdeaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Required Skills:</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Equity Offered:</h4>
          <p className="text-sm">{equity}%</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/ideas/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

