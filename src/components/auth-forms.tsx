import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'

export function SignUpForm() {
  const [userType, setUserType] = useState('developer')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    toast({
      title: 'Account created',
      description: 'Welcome to CoFounder! Please verify your email to continue.',
    })
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required />
      </div>
      <RadioGroup value={userType} onValueChange={setUserType}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="developer" id="developer" />
          <Label htmlFor="developer">Developer</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="founder" id="founder" />
          <Label htmlFor="founder">Founder</Label>
        </div>
      </RadioGroup>
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  )
}

export function SignInForm() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required />
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  )
}

