import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
}

export function Messaging() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'John', content: 'Hey, I'm interested in your project!', timestamp: '2023-06-01 10:00' },
    { id: '2', sender: 'You', content: 'Great! What skills can you bring to the team?', timestamp: '2023-06-01 10:05' },
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          sender: 'You',
          content: newMessage,
          timestamp: new Date().toLocaleString(),
        },
      ])
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Chat with John</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
            <div
              className={`inline-block rounded-lg p-2 ${
                message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              <p>{message.content}</p>
              <p className="mt-1 text-xs opacity-50">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  )
}

