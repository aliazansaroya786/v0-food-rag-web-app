"use client"

import { useState, useEffect } from "react"
import { FoodChat, ChatSession } from "@/components/food-chat"
import { ChatSidebar, Conversation } from "@/components/chat-sidebar"
import { Utensils } from "lucide-react"

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isClient, setIsClient] = useState(false)

  // Initialize conversations from localStorage
  useEffect(() => {
    setIsClient(true)
    const loadConversations = () => {
      try {
        const stored = localStorage.getItem("conversations")
        if (stored) {
          const convs: Conversation[] = JSON.parse(stored)
          setConversations(convs)
          if (convs.length > 0 && !activeConversationId) {
            setActiveConversationId(convs[0].id)
          }
        } else {
          createNewConversation()
        }
      } catch (err) {
        console.error("Failed to load conversations:", err)
        createNewConversation()
      }
    }
    loadConversations()
  }, [])

  const createNewConversation = () => {
    const newId = crypto.randomUUID()
    setActiveConversationId(newId)
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      timestamp: Date.now(),
      messageCount: 0,
    }
    const updated = [newConversation, ...conversations]
    setConversations(updated)
    localStorage.setItem("conversations", JSON.stringify(updated))
  }

  const handleConversationUpdate = (session: ChatSession) => {
    setConversations((prev) => {
      const updated = prev.map((conv) =>
        conv.id === session.id
          ? {
              ...conv,
              title: session.title,
              timestamp: session.timestamp,
              messageCount: session.messages.length,
            }
          : conv
      )
      // Sort by timestamp (newest first)
      updated.sort((a, b) => b.timestamp - a.timestamp)
      localStorage.setItem("conversations", JSON.stringify(updated))
      return updated
    })
  }

  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter((conv) => conv.id !== id)
    setConversations(updated)
    localStorage.setItem("conversations", JSON.stringify(updated))
    localStorage.removeItem(`conversation-${id}`)

    // Switch to another conversation or create new one
    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id)
      } else {
        createNewConversation()
      }
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Utensils className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Food RAG</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered food assistant with vector search
            </p>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewConversation={createNewConversation}
          onSelectConversation={setActiveConversationId}
          onDeleteConversation={handleDeleteConversation}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {activeConversationId && (
            <FoodChat
              conversationId={activeConversationId}
              onConversationUpdate={handleConversationUpdate}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="px-4 py-3 text-center text-sm text-muted-foreground">
          Powered by Upstash Vector Search and Groq LLM
        </div>
      </footer>
    </div>
  )
}
