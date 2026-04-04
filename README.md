# Marketing Planner Agent

An AI-powered marketing planning assistant that takes a high-level marketing goal and autonomously decomposes it into actionable tasks, validates resource availability, and generates a detailed execution schedule with dependency tracking.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Validation Tools](#validation-tools)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Example Goals](#example-goals)
- [Notes](#notes)

---

## Overview

The Marketing Planner Agent is a full-stack application that combines a FastAPI backend with a React frontend. When a user provides a high-level marketing goal, the backend uses the LLaMA 3.3 language model via the Groq API to decompose that goal into a structured list of subtasks. Each subtask is then passed through three mock validation tools that check budget availability, team member availability, and timeline feasibility. The results are assembled into an ordered execution schedule that surfaces task dependencies and flags any items that cannot be scheduled.

The application includes a login and signup flow, a landing page, and a protected planner interface accessible only to authenticated users.

---

## Architecture

```
User (Browser)
    |
React Frontend (Vite + TypeScript + Tailwind CSS)
    |
FastAPI Backend (Python)
    |
Planner Agent (LangChain + Groq API)
    |
Mock Validation Tools
    |-- Budget Checker
    |-- Team Availability Checker
    |-- Timeline Validator
    |
Execution Scheduler
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Python 3.11 | Runtime |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| LangChain | LLM orchestration |
| Groq API (LLaMA 3.3-70b) | Language model inference |
| python-dotenv | Environment variable management |

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| Lucide React | Icons |

---

## Project Structure

```
marketing_planner/
|
|-- api/
|   |-- __init__.py
|   |-- app.py                  # FastAPI application, CORS config, and endpoints
|
|-- agents/
|   |-- __init__.py
|   |-- planner_agent.py        # LLM-based task decomposition and validation logic
|
|-- tools/
|   |-- __init__.py
|   |-- budget_checker.py       # Mock tool to validate task budget
|   |-- team_availability.py    # Mock tool to check team member availability
|   |-- timeline_validator.py   # Mock tool to validate task timeline and conflicts
|
|-- utils/
|   |-- __init__.py
|   |-- scheduler.py            # Generates the final ordered execution schedule
|
|-- web/
|   |-- public/
|   |   |-- favicon.svg
|   |-- src/
|   |   |-- components/
|   |   |   |-- LoginPage.tsx   # Login and signup page
|   |   |   |-- PlannerPanel.tsx # Goal input form and schedule results display
|   |   |-- App.tsx             # Root component with route definitions
|   |   |-- types.ts            # TypeScript interfaces for API response shapes
|   |   |-- main.tsx            # React application entry point
|   |   |-- index.css           # Global styles and Tailwind directives
|   |-- index.html
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.js
|   |-- tsconfig.json
|
|-- main.py                     # CLI entry point for running the agent in the terminal
|-- requirements.txt            # Python dependencies
|-- .env                        # Secret keys (not committed to source control)
|-- .gitignore
|-- README.md
```

---

## Local Setup

### Prerequisites

- Python 3.11
- Node.js 18 or higher
- A Groq API key, available for free at https://console.groq.com

### Step 1 - Clone the Repository

```bash
git clone https://github.com/your-username/marketing-planner-agent.git
cd marketing-planner-agent
```

### Step 2 - Set Up the Python Environment

```bash
py -3.11 -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

### Step 3 - Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 4 - Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Step 5 - Start the Backend Server

```bash
py -3.11 -m uvicorn api.app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### Step 6 - Install Frontend Dependencies

Open a second terminal window and run:

```bash
cd web
npm install
```

### Step 7 - Start the Frontend Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Running from the CLI

To run the planner directly in the terminal without the web interface:

```bash
py -3.11 main.py
```

---

## API Reference

### Health Check

```
GET /api/health
```

Returns the status of the API and confirms whether the Groq API key is configured.

Response:

```json
{
  "ok": true,
  "has_groq_key": true
}
```

### Generate Plan

```
POST /api/plan
```

Accepts a marketing goal and returns a validated execution schedule.

Request body:

```json
{
  "goal": "Analyze Competitor Ads"
}
```

Response:

```json
{
  "schedule": {
    "generated_at": "2026-04-04 10:00:00",
    "total_tasks": 6,
    "ready_count": 5,
    "flagged_count": 1,
    "timeline": [
      {
        "order": 1,
        "task_name": "Ad Research",
        "description": "Identify and collect competitor ads from various channels.",
        "start_day": 1,
        "end_day": 4,
        "duration_days": 3,
        "team_members": ["data_analyst", "social_media_mgr"],
        "estimated_cost": 500,
        "depends_on": []
      }
    ],
    "flagged": [
      {
        "task_name": "Insights and Recommendations",
        "reasons": ["Budget insufficient"]
      }
    ],
    "summary": {
      "total_budget": 2200,
      "team_involved": ["data_analyst", "content_writer", "campaign_manager"],
      "project_duration": 23,
      "completion_rate": "5/6 tasks ready"
    }
  }
}
```

---

## Authentication

The application uses a mock authentication system for demonstration purposes. The following credentials are pre-configured:

| Email | Password |
|---|---|
| demo@planner.ai | password123 |
| ayush@planner.ai | ayush123 |

New accounts can be registered through the Sign Up flow on the login page. Accounts are stored in memory during the session. There is no persistent database in this implementation, so accounts created during a session will not persist across page refreshes.

After a successful login, the user is redirected to the protected planner interface at `/planner`. Unauthenticated users who attempt to access `/planner` directly are redirected to `/login`.

---

## Validation Tools

### Budget Checker

Checks whether the estimated cost of a task falls within the available budget assigned to that task category. Returns an approved or rejected status along with the available and requested amounts.

### Team Availability Checker

Checks whether the required team members are available and not currently assigned to other tasks. Returns an availability status for each requested member. Available team roles are: content_writer, seo_specialist, social_media_mgr, graphic_designer, data_analyst, email_marketer, and campaign_manager.

### Timeline Validator

Checks whether a task fits within the 30-day project window and does not overlap with already scheduled tasks. Returns a valid, conflict, or invalid status depending on the outcome.

All three tools use mock data. In a production system, these tools would be replaced with integrations to real finance systems, HR platforms, and project management tools such as Jira or Asana.

---

## Deployment

The application is split across two hosting platforms.

| Component | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://marketing-planner-agent.vercel.app |
| Backend | Render | https://marketing-planner-api.onrender.com |

### Deploying the Backend to Render

1. Create a new Web Service on Render and connect it to your GitHub repository.
2. Set the following configuration:
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api.app:app --host 0.0.0.0 --port $PORT`
3. Under the Environment section, add the `GROQ_API_KEY` environment variable.
4. Select the Free tier and click Create Web Service.

### Deploying the Frontend to Vercel

1. Import your GitHub repository into Vercel.
2. Set the following configuration:
   - Framework Preset: Vite
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Under Environment Variables, add `VITE_API_URL` with the value set to your Render backend URL.
4. Click Deploy.

---

## Environment Variables

### Backend

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | API key from console.groq.com | Yes |

### Frontend

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Base URL of the deployed backend | Production only |

When running locally, the Vite development server proxies `/api` requests to `http://localhost:8000` automatically, so `VITE_API_URL` is not required in local development.

---

## Example Goals

The following inputs work well with the planner:

- Analyze Competitor Ads
- Launch a Social Media Campaign for a new product
- Plan an Email Marketing Strategy for a SaaS product
- Create a 30-day Instagram marketing campaign for a fitness app
- Build a content marketing strategy for a B2B software company
- Run an SEO optimization project for an e-commerce website

---

## Notes

- The Groq free tier provides up to 6,000 requests per day with no credit card required.
- The Render free tier spins the server down after 15 minutes of inactivity. The first request after an idle period may take up to 50 seconds while the server restarts. This is expected behavior on the free tier.
- The LLM response is non-deterministic. Running the same goal multiple times may produce different task breakdowns.
- All validation data is mocked. Budget limits, team schedules, and timeline constraints are hardcoded for demonstration purposes.

---

## License

This project is intended for educational and demonstration purposes.