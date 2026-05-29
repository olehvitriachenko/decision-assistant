<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Tech Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Supabase
* OpenAI
* Zod

---

# Project Goals

Implement:

1. Authentication
2. Decision creation
3. LLM analysis
4. Decision history
5. Loading / Error / Retry states

---

# AI Analysis Output

```ts
{
  category: string;
  confidence: number;
  biases: string[];
  alternatives: string[];
  summary: string;
}
```

Store structured output in the database.

---

# Architecture

* Prefer Server Components by default.
* Use Client Components only when necessary.
* Prefer Server Actions over API routes when possible.
* Use TypeScript strictly.
* Use Zod validation.
* Keep business logic outside UI components.
* Keep database logic in dedicated modules.
* Avoid unnecessary abstractions.

---

# UI

* Use shadcn/ui components.
* Support dark mode.
* Handle loading states.
* Handle error states.
* Handle empty states.

---

# Database

Tables:

## decisions

* id
* userId
* title
* situation
* decision
* thoughts
* status
* createdAt
* updatedAt

## analyses

* id
* decisionId
* category
* confidence
* summary
* biases
* alternatives
* createdAt

Status values:

* processing
* completed
* failed

---

# Code Style

* Prefer async/await.
* Prefer named exports.
* Keep components small and focused.
* Use descriptive naming.
* Avoid deeply nested code.

---

# Do Not Introduce

* Redux
* MobX
* Microservices
* Redis
* Queue systems
* Docker setup
* Complex state management

Keep the solution simple and focused on the assignment requirements.
