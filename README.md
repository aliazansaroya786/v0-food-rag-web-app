# 🍽️ Food RAG Web Application

> A full-stack AI-powered food knowledge base built with Next.js, Upstash Vector, and Groq — deployed worldwide via Vercel.

---

## 👤 About This Project

**Author:** Ali Azan  
**University:** Victoria University  
**Subject:** AI Data Analyst Industry Project  
**Week 2:** Local RAG (ChromaDB + Ollama)  
**Week 3:** Cloud RAG (Upstash Vector + Groq)  
**Week 4:** Web Application (Next.js + v0.dev + Vercel)

---

## 🌐 Live Demo

🔗 **Live Application:** https://v0-food-rag-web-kwjyb267y-aliazansaroya786-9170s-projects.vercel.app/  
🔗 **GitHub Repository:** https://github.com/aliazansaroya786/v0-food-rag-web-app  
🔗 **v0.dev Project:** https://v0.app/chat/projects/prj_EGpZfskb3IAkoxUKNtBGuRc7Hgzy

---

## 🚀 Development Journey

```
WEEK 2 — Local Python CLI
─────────────────────────
ChromaDB + Ollama (local)
Terminal interface
Single machine only
15-60 second responses
        ↓

WEEK 3 — Cloud Python CLI
──────────────────────────
Upstash Vector + Groq (cloud)
Terminal interface
Accessible anywhere
1-3 second responses
        ↓

WEEK 4 — Web Application
─────────────────────────
Next.js 15 + v0.dev + Vercel
Modern chat interface
Worldwide access via URL
Real-time streaming responses
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |
| **UI Components** | Shadcn UI |
| **Vector Database** | Upstash Vector (bge-large-en-v1.5) |
| **LLM** | Groq (llama-3.3-70b-versatile) |
| **Deployment** | Vercel |
| **AI Builder** | v0.dev |
| **Food Database** | 110+ diverse food items |

---

## ✨ Features

```
✅ Modern chat interface with food/cooking theme
✅ Real-time AI responses powered by Groq
✅ Vector similarity search via Upstash
✅ Shows retrieved sources for transparency
✅ Model selection dropdown
✅ Loading states and error handling
✅ Mobile responsive design
✅ Example queries for new users
✅ Chat history within session
```

---

## 🏗️ Architecture

```
User Browser
     ↓
Next.js 15 Web App (Vercel)
     ↓
Server Actions (API layer)
     ↙              ↘
Upstash Vector      Groq Cloud API
(semantic search)   (answer generation)
     ↘              ↙
    Final Response to User
```

---

## 🍽️ Food Database (110+ Items)

### Original 75 Items
Diverse foods from Asia, Pacific, Middle East, and more

### Week 2 Additions (15 items)
- 🇵🇰 5 Pakistani cultural foods
  - Halwa Puri, Sajji, Chapli Kebab, Dum Pukht Biryani, Sheer Khurma
- 🥗 5 healthy foods
  - Salmon, Quinoa, Avocado, Greek Yogurt, Lentil Soup
- 🌍 5 international dishes
  - Margherita Pizza, Tacos al Pastor, Croissant, Jollof Rice, Paella

### Week 3 Additions (20 items)
- 🌏 8 world cuisines (Thai, Mediterranean, Egyptian, Moroccan, Ethiopian, Peruvian, Polish, Russian)
- 🥦 6 health-conscious options (Broccoli, Sweet Potato, Chia Seeds, Edamame, Kale, Greek Salad)
- 🍲 6 comfort foods (Mac and Cheese, Ramen, Poutine, Pierogi, Beef Stroganoff, Butter Mochi)

---

## ⚡ Performance Metrics

| Metric | Week 2 Local | Week 3 Cloud | Week 4 Web |
|--------|-------------|--------------|------------|
| Response Time | 15-60s | 1-3s | 1-3s |
| Interface | Terminal | Terminal | Modern UI |
| Access | One machine | Anywhere | Worldwide URL |
| Setup needed | Ollama + Python | Python + .env | Just visit URL! |
| Cost | Free | Free | Free |

---

## 🔑 Environment Variables

```env
UPSTASH_VECTOR_REST_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
GROQ_API_KEY=your_groq_key
```

---

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/aliazansaroya786/v0-food-rag-web-app.git
cd v0-food-rag-web-app

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in your credentials

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 💬 Example Queries

```
What is Chapli Kebab?
Which foods are high in protein?
What vegan options are available?
Tell me about Pakistani breakfast foods
What healthy Mediterranean options are available?
What comfort foods are available?
What foods can be grilled?
Tell me about traditional desserts
```

---

## 📁 Repository Structure

```
v0-food-rag-web-app/
├── app/
│   ├── page.tsx          # Main chat interface
│   ├── layout.tsx        # App layout
│   └── actions.ts        # Server actions (RAG logic)
├── components/
│   └── ui/               # Shadcn UI components
├── lib/
│   └── utils.ts          # Utility functions
├── docs/
│   └── architecture.md   # System documentation
└── README.md
```

---

## 🔗 Previous Versions

- **Week 2-3 Repository:** https://github.com/aliazansaroya786/ragfood
- **Local version:** /local-version/rag_run.py
- **Cloud version:** /cloud-version/cloud_rag.py

---

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| No responses | Check GROQ_API_KEY in environment variables |
| Empty search results | Check UPSTASH credentials |
| Build fails | Run `npm install` again |
| Slow responses | Normal — Groq free tier has rate limits |

---

## 🏆 Built With AI

This web application was built using:
- **v0.dev** for AI-powered Next.js code generation
- **Claude (Anthropic)** for migration planning and documentation
- **Groq** for fast LLM inference
- **Upstash** for serverless vector database