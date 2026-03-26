"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UsageDashboard } from "@/components/usage-dashboard"
import { Plus, Trash2, MessageSquare } from "lucide-react"

export interface Conversation {
  id: string
  title: string
  timestamp: number
  messageCount: number
}

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
}: ChatSidebarProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <aside className="w-64 border-r bg-secondary/30 flex flex-col h-full">
      {/* New Conversation Button */}
      <div className="p-4 border-b">
        <Button onClick={onNewConversation} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No conversations yet
          </p>
        ) : (
          conversations.map((conversation) => (
            <div key={conversation.id} className="group">
              <Card
                className={`p-3 cursor-pointer transition-colors ${
                  activeConversationId === conversation.id
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground truncate">
                        {conversation.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(conversation.timestamp)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.messageCount} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConversation(conversation.id)
                    }}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Usage Dashboard */}
      <UsageDashboard />
    </aside>
  )
}
