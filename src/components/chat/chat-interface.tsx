'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  text: string;
  sender: 'user' | 'guide';
}

interface ChatInterfaceProps {
  guideName: string;
}

export function ChatInterface({ guideName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hi there! I'm interested in a tour. Are you available this weekend?`, sender: 'user' },
    { text: `Hello! Thanks for reaching out. I have some availability on Saturday. What time were you thinking?`, sender: 'guide' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Chat with {guideName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-80 overflow-y-auto p-4 border rounded-md mb-4 bg-secondary/30">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'guide' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/100" alt={guideName} />
                  <AvatarFallback>{guideName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{message.text}</p>
              </div>
               {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/100?grayscale" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="h-12 text-base"
          />
          <Button type="submit" size="icon" className="h-12 w-12 flex-shrink-0">
            <Send className="h-6 w-6" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
