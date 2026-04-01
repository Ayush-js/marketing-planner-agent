\# 🤖 Marketing Planner Agent



An AI-powered Marketing Planning Assistant built with LangChain, CrewAI, and Groq (LLaMA 3.3).



\## 🧠 What it does

\- Takes a high-level marketing goal (e.g. "Analyze Competitor Ads")

\- Breaks it down into actionable subtasks automatically

\- Validates budget, team availability, and timeline for each task

\- Generates a detailed execution schedule



\## 🛠️ Tech Stack

\- Python 3.11

\- LangChain

\- CrewAI

\- Groq API (LLaMA 3.3) — Free

\- python-dotenv



\## 📁 Project Structure

```

marketing\_planner/

├── agents/

│   └── planner\_agent.py

├── tools/

│   ├── budget\_checker.py

│   ├── team\_availability.py

│   └── timeline\_validator.py

├── utils/

│   └── scheduler.py (coming soon)

├── .env (not tracked)

├── .gitignore

├── test\_connection.py

└── README.md

```



\## 🚀 Setup

1\. Clone the repo

2\. Install dependencies:

```bash

&#x20;  py -3.11 -m pip install langchain langchain-groq groq python-dotenv crewai

```

3\. Create a `.env` file and add your Groq API key:

```

&#x20;  GROQ\_API\_KEY=your\_key\_here

```

4\. Run the agent:

```bash

&#x20;  py -3.11 main.py

```



\## 🔑 Get a Free Groq API Key

Sign up at https://console.groq.com — no credit card needed!

## Web UI

The `web/` app is a React + Vite + Tailwind interface styled like [SkyAgent](https://agent-magicui.vercel.app/) (marketing layout, dark/light toggle, planner section).

**Production-style (API + built UI on one origin):**

```bash
py -3.11 -m pip install -r requirements.txt
cd web
npm install
npm run build
cd ..
py -3.11 -m uvicorn api.app:app --host 127.0.0.1 --port 8000
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). The planner calls `POST /api/plan` (requires `GROQ_API_KEY` in `.env`).

**Development (hot reload for the frontend):**

```bash
py -3.11 -m uvicorn api.app:app --reload --host 127.0.0.1 --port 8000
```

In another terminal: `cd web && npm run dev` and open [http://127.0.0.1:5173](http://127.0.0.1:5173) (Vite proxies `/api` to port 8000).

