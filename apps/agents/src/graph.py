from langgraph.graph import StateGraph, END
from typing import TypedDict, List
import psycopg

class FarmState(TypedDict):
    query: str
    context: dict
    actions: List[str]
    approval_required: bool
    approved: bool

def router(state: FarmState) -> str:
    # Route questions about chemical spraying or pesticide prescriptions to a safety check
    if "pesticide" in state["query"] or "chemical" in state["query"] or "spray" in state["query"]:
        return "chemical_safety_node"
    return "graphrag_search"

def chemical_safety_node(state: FarmState) -> FarmState:
    # Set verification flag
    state["approval_required"] = True
    state["actions"].append("Flagged for human-in-the-loop chemical safety review.")
    return state

def graphrag_search(state: FarmState) -> FarmState:
    from .graphrag.query import query_kg
    result = query_kg(state["query"])
    state["context"]["graphrag_data"] = result
    state["actions"].append("Executed GraphRAG database query.")
    return state

def router_node(state: FarmState) -> FarmState:
    return state

builder = StateGraph(FarmState)
builder.add_node("router_node", router_node)
builder.add_node("chemical_safety_node", chemical_safety_node)
builder.add_node("graphrag_search", graphrag_search)

builder.set_entry_point("router_node")
builder.add_conditional_edges("router_node", router)
builder.add_edge("chemical_safety_node", END)
builder.add_edge("graphrag_search", END)

# Configure database saver for state checkpointing with in-memory fallback
try:
    from langgraph.checkpoint.postgres import PostgresSaver
    conn = psycopg.connect("postgresql://postgres:password@localhost:5433/ecofarm")
    memory = PostgresSaver(conn)
    graph = builder.compile(checkpointer=memory, interrupt_before=["chemical_safety_node"])
    print("[SUCCESS] Configured PostgresSaver checkpointer successfully.")
except Exception as e:
    from langgraph.checkpoint.memory import MemorySaver
    print(f"[WARNING] PostgresSaver connection failure: {e}. Falling back to in-memory MemorySaver checkpointer.")
    memory = MemorySaver()
    graph = builder.compile(checkpointer=memory, interrupt_before=["chemical_safety_node"])
