"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export interface SearchResult {
  id: string
  score: number
  metadata?: {
    text?: string
    region?: string
    type?: string
  }
}

export interface RAGResponse {
  sources: SearchResult[]
  answer: string
  question: string
}

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

async function vectorSearch(question: string): Promise<SearchResult[]> {
  const url = process.env.UPSTASH_SEARCH_REST_URL
  const token = process.env.UPSTASH_SEARCH_REST_TOKEN

  if (!url || !token) {
    throw new Error("Upstash Search credentials not configured")
  }

  const response = await fetch(`${url}/query-data`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: question,
      topK: 3,
      includeMetadata: true,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Vector search failed: ${errorText}`)
  }

  const data = await response.json()
  return data.result || []
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
      const text = result.metadata?.text || "No content available"
      const region = result.metadata?.region || "Unknown"
      const type = result.metadata?.type || "Unknown"
      return `[${index + 1}] ${text} (Region: ${region}, Type: ${type})`
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
