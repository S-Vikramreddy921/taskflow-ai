# TaskFlow AI

A full-stack Kanban board with an AI assistant that fills in task descriptions and
suggests a priority from just a title — built to demonstrate backend API design,
React frontend development, and real LLM integration in one project.

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

- **Board / BoardColumn / Task** — JPA entities with a standard one-to-many hierarchy.
- **REST API** — `BoardController`, `TaskController`, `AiController` expose CRUD +
  a drag-and-drop "move task" endpoint (`PATCH /api/tasks/{id}/move`) that persists
  column and position changes.
- **AiAssistantService** — calls the Anthropic Messages API server-side (so the API
  key never touches the browser), prompts for a structured JSON response, and parses
  it into a description + priority.
- **Frontend** — one `Board` component holding drag-and-drop state, with optimistic
  UI updates on drag so the board feels instant, then syncs the move to the backend.

## Running it locally

### Prerequisites
- Java 17+
- Maven (or use the included wrapper if you add one via `mvn -N wrapper:wrapper`)
- Node.js 18+
- An Anthropic API key (for the AI Suggest feature — everything else works without it)

### 1. Backend

```bash
cd backend
export ANTHROPIC_API_KEY=your-key-here   # optional, only needed for AI Suggest
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. A demo board with 3 columns and a few
seeded tasks is created automatically (see `src/main/resources/data.sql`).

You can browse the H2 database console at `http://localhost:8080/h2-console`
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
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task's title/description/priority |
| PATCH | `/api/tasks/{id}/move` | Move a task to a new column/position (drag-and-drop) |
| DELETE | `/api/tasks/{id}` | Delete a task |
| POST | `/api/ai/suggest` | `{ title, context }` → AI-generated description + priority |

## What to build on next

- Swap H2 for Postgres and add a `docker-compose.yml` (great "productionizing" story for interviews)
- Add JWT auth so boards are per-user
- Add unit tests (`@WebMvcTest` for controllers, `@DataJpaTest` for repositories) and a GitHub Actions CI workflow
- Deploy: backend to Render/Fly.io, frontend to Vercel/Netlify — gives you a live demo link for your resume

## Suggested resume bullets (once you've run it, tweaked it, and pushed it to GitHub)

- Built a full-stack Kanban application (Java/Spring Boot, React) with a REST API supporting CRUD operations and drag-and-drop task reordering persisted via a `PATCH` move endpoint.
- Integrated the Anthropic Claude API into a Spring Boot service to auto-generate task descriptions and priority suggestions from user input, including structured JSON prompt design and response parsing.
- Designed a normalized JPA data model (Board → Column → Task) with cascading relationships and used H2/Postgres for persistence.
- Implemented optimistic UI updates in React for drag-and-drop interactions to keep the interface responsive during async backend writes.

*(Only use these once they're true — after you've actually run it, poked at it, and ideally pushed a few commits of your own on top.)*
