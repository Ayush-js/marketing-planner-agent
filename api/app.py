"""HTTP API for the marketing planner (serves JSON for the web UI)."""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

load_dotenv(ROOT / ".env")

from agents.planner_agent import run_planner_agent
from utils.scheduler import generate_schedule

app = FastAPI(title="Marketing Planner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://marketing-planner-agent.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PlanRequest(BaseModel):
    goal: str = Field(..., min_length=1, max_length=4000)


@app.get("/api/health")
def health():
    return {"ok": True, "has_groq_key": bool(os.environ.get("GROQ_API_KEY"))}


@app.post("/api/plan")
def create_plan(body: PlanRequest):
    if not os.environ.get("GROQ_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY is not set. Add it to your .env file.",
        )
    try:
        validated = run_planner_agent(body.goal.strip(), verbose=False)
        schedule = generate_schedule(validated, verbose=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    return {"schedule": schedule}


# Optional: serve Vite build from `web/dist` (same origin as `/api/*`)
_DIST = ROOT / "web" / "dist"
if _DIST.is_dir():
    _assets = _DIST / "assets"
    if _assets.is_dir():
        app.mount("/assets", StaticFiles(directory=str(_assets)), name="assets")

    @app.get("/")
    def serve_index():
        index = _DIST / "index.html"
        if not index.is_file():
            raise HTTPException(status_code=404, detail="index.html missing")
        return FileResponse(index)

    @app.get("/favicon.svg")
    def serve_favicon():
        p = _DIST / "favicon.svg"
        if not p.is_file():
            raise HTTPException(status_code=404, detail="Not found")
        return FileResponse(p)
