import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Github, Linkedin } from 'lucide-react'

export function ProfilePage({ userType }: { userType: 'developer' | 'founder' }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="h-24 w-24 rounded-full bg-gray-200"></div>
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-gray-500">{userType === 'developer' ? 'Full Stack Developer' : 'Startup Founder'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">About Me</h2>
        <Textarea placeholder="Tell us about yourself..." />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'Node.js', 'Python'].map((skill) => (
            <div key={skill} className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
              {skill}
            </div>
          ))}
        </div>
        <Input placeholder="Add a new skill" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Past Projects</h2>
        <div className="space-y-2">
          <Input placeholder="Project name" />
          <Textarea placeholder="Project description" />
        </div>
        <Button variant="outline">Add Project</Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Social Links</h2>
        <div className="flex items-center space-x-2">
          <Github className="h-5 w-5" />
          <Input placeholder="GitHub profile URL" />
        </div>
        <div className="flex items-center space-x-2">
          <Linkedin className="h-5 w-5" />
          <Input placeholder="LinkedIn profile URL" />
        </div>
      </div>

      <Button className="w-full">Save Profile</Button>
    </div>
  )
}

