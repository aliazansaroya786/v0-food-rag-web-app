import { FoodChat } from "@/components/food-chat"
import { Utensils } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
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

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto">
        <FoodChat />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-4xl mx-auto px-4 py-3 text-center text-sm text-muted-foreground">
          Powered by Upstash Vector Search and Groq LLM
        </div>
      </footer>
    </div>
  )
}
