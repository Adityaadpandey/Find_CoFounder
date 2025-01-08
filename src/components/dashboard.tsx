import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Dashboard({ userType }: { userType: 'developer' | 'founder' }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{userType === 'developer' ? 'My Applications' : 'My Ideas'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">5</p>
            <Button asChild className="mt-4 w-full">
              <Link href={userType === 'developer' ? '/applications' : '/my-ideas'}>View All</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">3</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">80%</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      {userType === 'founder' && (
        <Button asChild>
          <Link href="/create-idea">Create New Idea</Link>
        </Button>
      )}
    </div>
  )
}

