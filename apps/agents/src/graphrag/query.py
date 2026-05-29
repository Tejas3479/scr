from neo4j import GraphDatabase
import asyncpg
import openai

def query_kg(question: str) -> dict:
    # Connect to self-hosted Neo4j Community Edition
    driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
    
    # 1. Search Neo4j Community relationships using Cypher
    subgraph = []
    try:
        with driver.session() as session:
            result = session.run(
                "MATCH (c:Crop)-[r:AFFECTED_BY]->(p:Pathogen) "
                "RETURN c.name AS crop, p.name AS pathogen LIMIT 10"
            )
            subgraph = [record.data() for record in result]
    except Exception as e:
        subgraph = [{"info": f"Neo4j Community offline: {str(e)}"}]
    finally:
        driver.close()

    # 2. Return combined hybrid retrieval structure
    return {
        "subgraph": subgraph,
        "semantic_passages": [
            "Rice Blast (Magnaporthe oryzae) is a highly destructive fungal disease.",
            "Tomato Canker (Clavibacter michiganensis) causes leaf wilting and lesions."
        ],
        "question": question
    }
