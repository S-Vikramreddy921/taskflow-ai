# TaskFlow AI

A full-stack Kanban board with an AI assistant that fills in task descriptions
and suggests a priority from just a title. Built to demonstrate backend API
design, React frontend development, and real LLM integration in one project.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Claude API](https://img.shields.io/badge/AI-Claude%20API-6E56CF)

## Features

- **Drag-and-drop Kanban board** — move tasks between To Do / In Progress / Done, with the new position persisted to the backend
- **AI task assistant** — click "✨ AI Suggest" on a new task and Claude writes a description and picks a priority from just the title
- **Due dates** — set an optional due date per task, with an "Overdue" badge that highlights automatically
- **Bulk clear** — a "Clear Done tasks" button to sweep a column in one click
- **Full CRUD REST API** — create, update, move, and delete tasks and boards
- **Zero-setup local database** — H2 in-memory DB, seeded with demo data, no install required

## Stack

| Layer | Tech |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Data JPA, H2 (in-memory) |
| Frontend | React 18, `@hello-pangea/dnd` (drag-and-drop), Axios |
| AI | Anthropic Claude API (Messages endpoint) |

## Architecture

```
┌─────────────┐      REST/JSON      ┌──────────────────┐      HTTPS       ┌──────────────┐
│   React     │ ──────────────────> │  Spring Boot API  │ ───────────────> │  Claude API  │
│  (port 3000)│ <────────────────── │   (port 8080)     │ <─────────────── │              │
└─────────────┘                     └──────────────────┘                  └──────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │   H2 (in-memory)  │
                                     └──────────────────┘
```

- **Board → BoardColumn → Task** — JPA entities with a standard one-to-many hierarchy
- **REST API** — `BoardController`, `TaskController`, `AiController` expose CRUD plus a
  drag-and-drop "move task" endpoint (`PATCH /api/tasks/{id}/move`) that persists
  column and position changes
- **AiAssistantService** — calls the Anthropic Messages API server-side (so the API key
  never touches the browser), prompts for a structured JSON response, and parses it
  into a description + priority
- **Frontend** — a `Board` component holds drag-and-drop state, with optimistic UI
  updates so the board feels instant, then syncs the move to the backend

## Running it locally

### Prerequisites
- Java 17+
- Maven
- Node.js 18+
- An Anthropic API key (only needed for the AI Suggest feature — everything else works without it)

### 1. Backend

```bash
cd backend
export ANTHROPIC_API_KEY=your-key-here   # optional, only needed for AI Suggest
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. A demo board with 3 columns and a few
seeded tasks (including due dates) is created automatically — see
`src/main/resources/data.sql`.

Browse the H2 database console at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:taskflow`).

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000` and talks to the backend at `localhost:8080`.

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/boards/{id}` | Fetch a board with its columns and tasks |
| POST | `/api/boards` | Create a board `{ name, columns: [...] }` |
| POST | `/api/tasks` | Create a task (title, description, priority, columnId, dueDate) |
| PUT | `/api/tasks/{id}` | Update a task's title/description/priority/dueDate |
| PATCH | `/api/tasks/{id}/move` | Move a task to a new column/position (drag-and-drop) |
| DELETE | `/api/tasks/{id}` | Delete a single task |
| DELETE | `/api/columns/{columnId}/tasks` | Clear all tasks in a column (e.g. "Clear Done") |
| POST | `/api/ai/suggest` | `{ title, context }` → AI-generated description + priority |

## Challenges solved while building this

A few real issues that came up during setup and development — kept here because
"what broke and how I fixed it" is exactly what comes up in interviews:

- **Lombok + newer JDKs**: Homebrew installed two JVMs on macOS, and Maven defaulted
  to a version Lombok didn't yet support, which silently skipped generating getters/
  setters and produced dozens of "cannot find symbol" compiler errors. Fixed by
  explicitly pinning `JAVA_HOME` to JDK 17.
- **`java.net.http` header validation**: the built-in Java `HttpClient` throws
  `IllegalArgumentException: invalid header value` if the `x-api-key` header contains
  anything beyond the raw token — including invisible smart-quote characters
  auto-inserted by some text editors when an API key gets copy-pasted through them.
  Fixed by typing the `export` command's quotes directly in the terminal rather than
  pasting a pre-formatted command from elsewhere.

## What to build on next

- Swap H2 for Postgres and add a `docker-compose.yml` (great "productionizing" story for interviews)
- Add JWT auth so boards are per-user
- Add unit tests (`@WebMvcTest` for controllers, `@DataJpaTest` for repositories) and a GitHub Actions CI workflow
- Deploy: backend to Render/Fly.io, frontend to Vercel/Netlify — gives you a live demo link for your resume

## Resume bullets (only use once they're true for you)

- Built a full-stack Kanban application (Java/Spring Boot, React) with a REST API supporting CRUD operations and drag-and-drop task reordering persisted via a `PATCH` move endpoint.
- Integrated the Anthropic Claude API into a Spring Boot service to auto-generate task descriptions and priority suggestions from user input, including structured JSON prompt design and response parsing.
- Designed a normalized JPA data model (Board → Column → Task) with cascading relationships and used H2/Postgres for persistence.
- Implemented optimistic UI updates in React for drag-and-drop interactions to keep the interface responsive during async backend writes.
- Debugged and resolved a JDK version conflict affecting annotation processing (Lombok) and an HTTP header-encoding issue in a Java `HttpClient` integration.
