from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .graph import graph

app = FastAPI(title="LangGraph Agentic Service", version="3.0.0")

class QueryRequest(BaseModel):
    query: str
    thread_id: str

@app.post("/agent/query")
async def run_agent(req: QueryRequest):
    try:
        config = {"configurable": {"thread_id": req.thread_id}}
        initial_state = {
            "query": req.query,
            "context": {},
            "actions": [],
            "approval_required": False,
            "approved": False
        }
        
        # Run graph
        final_state = graph.invoke(initial_state, config)
        return final_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
