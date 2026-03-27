"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { ragQuery, type RAGResponse } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Send, Utensils, Leaf, BookOpen, Sparkles } from "lucide-react"
import { trackQuery } from "@/lib/usage-tracker"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  sources?: RAGResponse["sources"]
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  timestamp: number
}

interface FoodChatProps {
  conversationId: string
  onConversationUpdate: (session: ChatSession) => void
}

export function FoodChat({ conversationId, onConversationUpdate }: FoodChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleQuery = (query: string) => {
    setInput(query)
    // Trigger form submission after setting input
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }))
      }
    }, 0)
  }

  // Load messages from localStorage
  useEffect(() => {
    const loadMessages = () => {
      try {
        const stored = localStorage.getItem(`conversation-${conversationId}`)
        if (stored) {
          const session = JSON.parse(stored) as ChatSession
          setMessages(session.messages)
        } else {
          setMessages([])
        }
      } catch (err) {
        console.error("Failed to load messages:", err)
        setMessages([])
      }
    }
    // Only load on client side
    if (typeof window !== "undefined") {
      loadMessages()
    }
  }, [conversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isPending) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content: input.trim(),
      timestamp: Date.now(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setError(null)

    startTransition(async () => {
      try {
        const response = await ragQuery(userMessage.content)

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          type: "assistant",
          content: response.answer,
          sources: response.sources,
          timestamp: Date.now(),
        }

        const updatedMessages = [...newMessages, assistantMessage]
        setMessages(updatedMessages)

        // Track usage stats
        trackQuery(response.usage.tokensUsed, response.usage.responseTimeMs)

        // Save to localStorage
        const session: ChatSession = {
          id: conversationId,
          title: newMessages[0]?.content?.substring(0, 50) || "New Conversation",
          messages: updatedMessages,
          timestamp: Date.now(),
        }
        localStorage.setItem(`conversation-${conversationId}`, JSON.stringify(session))
        onConversationUpdate(session)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleQuery} />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {isPending && (
          <div className="flex items-center gap-3 p-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Spinner className="w-5 h-5 text-primary" />
            </div>
            <div className="text-muted-foreground">
              Searching and generating response...
            </div>
          </div>
        )}

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 text-destructive">{error}</CardContent>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about food... (e.g., What yellow fruits are there?)"
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending || !input.trim()} size="icon">
            {isPending ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

function WelcomeScreen({ onSuggestionClick }: { onSuggestionClick: (query: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Utensils className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Food RAG Assistant
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Ask me anything about food! I use vector search to find relevant
        information and generate helpful answers.
      </p>

      <div className="grid gap-3 w-full max-w-md">
        <SuggestionCard
          icon={<Leaf className="w-4 h-4" />}
          text="What yellow fruits are there?"
          onClick={() => onSuggestionClick("What yellow fruits are there?")}
        />
        <SuggestionCard
          icon={<Sparkles className="w-4 h-4" />}
          text="Tell me about tropical foods"
          onClick={() => onSuggestionClick("Tell me about tropical foods")}
        />
        <SuggestionCard
          icon={<BookOpen className="w-4 h-4" />}
          text="What foods are spicy?"
          onClick={() => onSuggestionClick("What foods are spicy?")}
        />
      </div>
    </div>
  )
}

function SuggestionCard({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) {
  return (
    <Card className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={onClick}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="text-primary">{icon}</div>
        <span className="text-sm text-foreground">{text}</span>
      </CardContent>
    </Card>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl ${
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3"
            : "space-y-3"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <>
            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <Card className="bg-secondary/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    Sources ({message.sources.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2">
                  {message.sources.map((source, index) => (
                    <div
                      key={source.id}
                      className="text-sm p-2 rounded-lg bg-background"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary">
                          [{index + 1}]
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Score: {(source.score * 100).toFixed(1)}%
                        </span>
                        {source.metadata?.type && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
                            {source.metadata.type}
                          </span>
                        )}
                      </div>
                      <p className="text-foreground">
                        {source.content || source.metadata?.text || "No content"}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* AI Response */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
