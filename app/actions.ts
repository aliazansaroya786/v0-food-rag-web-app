"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { Index } from "@upstash/vector"

export interface SearchResult {
  id: string
  score: number
  metadata?: {
    text?: string
    region?: string
    type?: string
  }
  content?: string
}

export interface RAGResponse {
  sources: SearchResult[]
  answer: string
  question: string
}

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const index = new Index({
  url: process.env.UPSTASH_SEARCH_REST_URL,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN,
})

async function vectorSearch(question: string): Promise<SearchResult[]> {
  const results = await index.query({
    data: question,
    topK: 3,
    includeMetadata: true,
    includeData: true,
  })

  return results.map((result) => ({
    id: String(result.id),
    score: result.score,
    content: result.data,
    metadata: result.metadata as SearchResult["metadata"],
  }))
}

export async function ragQuery(question: string): Promise<RAGResponse> {
  if (!question.trim()) {
    throw new Error("Please enter a question")
  }

  // Step 1: Vector search to find relevant documents
  const searchResults = await vectorSearch(question)

  // Step 2: Build context from search results
  const context = searchResults
    .map((result, index) => {
      const text = result.content || result.metadata?.text || "No content available"
      const region = result.metadata?.region || ""
      const type = result.metadata?.type || ""
      const metaInfo = [region, type].filter(Boolean).join(", ")
      return `[${index + 1}] ${text}${metaInfo ? ` (${metaInfo})` : ""}`
    })
    .join("\n")

  // Step 3: Generate answer using Groq LLM
  const systemPrompt = `You are a helpful food expert assistant. Use the following context to answer questions about food.
If the context doesn't contain relevant information, say so honestly but try to be helpful.
Keep your answers concise and informative.

Context:
${context}`

  const { text: answer } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    system: systemPrompt,
    prompt: question,
    temperature: 0.7,
  })

  return {
    sources: searchResults,
    answer,
    question,
  }
}
