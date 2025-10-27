'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { explainVulnerability } from '@/ai/flows/explain-vulnerability';
import { useState, useRef, FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { VigilanteAiLogo } from '../logo';
import { marked } from 'marked';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiAssistant({ scanDetails }: { scanDetails: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const fullPrompt = `Based on the following scan results: ${scanDetails}\n\nUser query: ${input}`;
      const response = await explainVulnerability({
        vulnerabilityDetails: fullPrompt,
      });
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.explanation + '\n\n' + response.remediation,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const userInitials =
    user?.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('') ||
    user?.email?.charAt(0).toUpperCase() ||
    '?';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <VigilanteAiLogo className="w-12 h-12 mb-4 text-primary" />
                <p className="font-semibold">
                  Ask me anything about this scan.
                </p>
                <p className="text-sm">
                  For example: "Explain the XSS vulnerability in plain English"
                  or "Give me a code example to fix the insecure headers".
                </p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground">
                      <VigilanteAiLogo className="h-5 w-5" />
                    </div>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted w-full'
                  }`}
                >
                  {message.role === 'assistant' ? (
                     <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:whitespace-pre-wrap prose-pre:break-all" dangerouslySetInnerHTML={{ __html: marked(message.content) as string }} />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border">
                  <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground">
                    <VigilanteAiLogo className="h-5 w-5" />
                  </div>
                </Avatar>
                <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this vulnerability..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
