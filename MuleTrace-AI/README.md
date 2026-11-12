# MuleTrace AI

## Project Description

MuleTrace AI is a financial crime investigation platform designed to help analysts detect mule accounts, uncover fraud rings, and trace suspicious transaction flows. The monorepo brings together a frontend console, backend API services, an AI assistant, a graph analysis engine, and a machine learning engine to support structured, evidence-driven investigations.

## Problem Statement

Traditional fraud detection often produces high alert volumes without sufficient context to link accounts, transactions, and actors. Investigators need a unified workspace that can:
- Correlate accounts, transactions, and network relationships
- Surface risk signals with supporting evidence
- Provide AI-assisted analysis grounded in case data
- Maintain a traceable audit trail for investigation notes and findings

## Solution Overview

MuleTrace AI aims to provide a consolidated investigation console where analysts can:
- Review and triage alerts across the system
- Inspect transaction ledgers with risk indicators
- Investigate specific accounts and their connected activity
- Explore entity relationships through network analysis
- Query an AI assistant for summaries, hypotheses, and suggested next steps
- Assemble evidence into a case workspace for follow-up actions

At present, the frontend provides the investigation UI and API integration scaffolding. The backend, AI assistant, graph engine, and ML engine directories are placeholders and do not yet contain implemented services; end-to-end integration is not complete.

## Architecture

The system is organized as a monorepo with modular components:

```text
MuleTrace-AI/
├── frontend/        # React + Vite investigation console
├── backend/         # API service (placeholder)
├── ai-assistant/    # AI assistant service (placeholder)
├── graph-engine/    # Graph analysis and link discovery (placeholder)
├── ml-engine/       # Risk scoring and anomaly detection (placeholder)
└── docs/            # Project documentation (placeholder)
```

Frontend requests are expected to route to the backend API (default base URL `/api/v1`, proxied to `http://localhost:8000` in development). Domain logic for graph traversal, scoring, and assistant responses will be distributed across the respective modules as implementation progresses.

## Tech Stack

### Frontend
- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router 7](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Lucide React](https://lucide.dev/)
- [Cytoscape.js](https://js.cytoscape.org/) / [react-cytoscapejs](https://github.com/plotly/react-cytoscapejs)
- [Recharts](https://recharts.org/)

### Backend / Services (Planned)
- API service (to be defined in `backend/`)
- AI assistant service (to be defined in `ai-assistant/`)
- Graph engine for relationship analysis (to be defined in `graph-engine/`)
- ML engine for risk scoring and anomaly detection (to be defined in `ml-engine/`)

## Team Module Structure

| Module | Responsibility | Status |
| --- | --- | --- |
| `frontend/` | Analyst console UI, routing, API client, and investigation workflows | In progress |
| `backend/` | REST API, orchestration, and data access layer | Scaffolded |
| `ai-assistant/` | LLM integration and evidence-grounded assistant capabilities | Scaffolded |
| `graph-engine/` | Entity resolution, link analysis, and network graph construction | Scaffolded |
| `ml-engine/` | Feature engineering, risk scoring, and anomaly detection | Scaffolded |
| `docs/` | Architecture, ADRs, API contracts, and project documentation | Scaffolded |

## Frontend Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)

### Installation
```bash
cd frontend
npm install
```

### Environment Configuration
Copy the example environment file and adjust values as needed:
```bash
cp .env.example .env
```

Available variables:
- `VITE_API_BASE_URL` - API base path (default: `/api/v1`)
- `VITE_API_PROXY_TARGET` - Development proxy target for `/api` requests (default: `http://localhost:8000`)

### Development
```bash
npm run dev
```
The app runs on the Vite dev server (default `http://localhost:5173`). API calls to `/api` are proxied to `VITE_API_PROXY_TARGET`.

### Lint and Build
```bash
npm run lint
npm run build
npm run preview
```

## Backend Setup Placeholder

The `backend/` module is currently scaffolded with no implementation committed. Setup instructions (dependencies, environment variables, database configuration, and run commands) will be documented here once the service structure is defined.

## Current Development Status

- **Frontend**: Core layouts, routing, shared components, API client/hooks, and investigation-related pages are implemented. API integration is wired via services, but backend availability is not assumed.
- **Backend / AI Assistant / Graph Engine / ML Engine**: Modules exist as placeholders. No completed API contracts or running services are claimed at this time.
- **Integration**: End-to-end backend integration is not complete. The frontend uses defensive loading/error/empty states to handle unavailable or incomplete data.
- **Tooling**: Linting and production builds for the frontend are supported.
