from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
import redis
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Gamification Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
db = mongo_client.ecofarm
missions_collection = db.missions
leaderboard_collection = db.leaderboards
achievements_collection = db.achievements

# Redis connection
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

# Request models
class MissionCompletion(BaseModel):
    mission_id: str
    user_id: str
    evidence: Optional[dict] = None

class MissionRequest(BaseModel):
    user_id: str
    location: Optional[dict] = None
    language: str = "en"

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "gamification-service"}

# Initialize sample missions if collection is empty
async def initialize_missions():
    count = await missions_collection.count_documents({})
    if count == 0:
        sample_missions = [
            {
                "id": "mission_001",
                "title": "🌱 Set Up Composting",
                "description": "Create an organic compost pit on your farm",
                "icon": "🌱",
                "points": 500,
                "difficulty": "easy",
                "estimated_time": "2 hours",
                "time_remaining": "2 days left",
                "requirements": [],
                "rewards": {
                    "points": 500,
                    "badge": "compost_master"
                },
                "category": "sustainability",
                "active": True
            },
            {
                "id": "mission_002",
                "title": "💧 Install Drip Irrigation",
                "description": "Set up water-efficient irrigation system",
                "icon": "💧",
                "points": 800,
                "difficulty": "medium",
                "estimated_time": "4 hours",
                "time_remaining": "5 days left",
                "requirements": [],
                "rewards": {
                    "points": 800,
                    "badge": "water_warrior"
                },
                "category": "water_conservation",
                "active": True
            },
            {
                "id": "mission_003",
                "title": "🐛 Natural Pest Control",
                "description": "Use organic methods to control pests",
                "icon": "🐛",
                "points": 1200,
                "difficulty": "hard",
                "estimated_time": "6 hours",
                "time_remaining": "7 days left",
                "requirements": [],
                "rewards": {
                    "points": 1200,
                    "badge": "organic_master"
                },
                "category": "organic_farming",
                "active": True
            },
        ]
        await missions_collection.insert_many(sample_missions)

@app.get("/api/missions")
async def get_missions(
    user_id: Optional[str] = Query(None),
    language: str = Query("en"),
    limit: int = Query(10)
):
    """
    Get available missions for a user
    """
    try:
        await initialize_missions()
        
        # Get active missions from MongoDB
        cursor = missions_collection.find({"active": True}).limit(limit)
        missions = await cursor.to_list(length=limit)
        
        # Get user progress from Redis if user_id provided
        user_progress = {}
        if user_id:
            # Get user's mission progress from Redis
            for mission in missions:
                progress_key = f"mission:{user_id}:{mission['id']}:progress"
                progress = redis_client.get(progress_key)
                if progress:
                    user_progress[mission['id']] = int(progress)
        
        # Format missions with progress
        result_missions = []
        for mission in missions:
            mission_data = {
                "id": mission["id"],
                "title": mission["title"],
                "description": mission["description"],
                "icon": mission.get("icon", "🌾"),
                "points": mission["points"],
                "difficulty": mission["difficulty"],
                "estimated_time": mission.get("estimated_time", ""),
                "time_remaining": mission.get("time_remaining", ""),
                "progress": user_progress.get(mission["id"], 0),
                "rewards": mission.get("rewards", {})
            }
            result_missions.append(mission_data)
        
        return {"missions": result_missions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/missions/{mission_id}/complete")
async def complete_mission(mission_id: str, completion: MissionCompletion):
    """
    Complete a mission and award points/badges
    """
    try:
        # Get mission details
        mission = await missions_collection.find_one({"id": mission_id})
        if not mission:
            raise HTTPException(status_code=404, detail="Mission not found")
        
        # Update user progress to 100%
        progress_key = f"mission:{completion.user_id}:{mission_id}:progress"
        redis_client.set(progress_key, 100)
        
        # Award points
        points_awarded = mission["points"]
        redis_client.zincrby("leaderboard:global", points_awarded, completion.user_id)
        
        # Store completion in MongoDB
        await db.mission_completions.insert_one({
            "user_id": completion.user_id,
            "mission_id": mission_id,
            "completed_at": datetime.utcnow(),
            "points_awarded": points_awarded,
            "evidence": completion.evidence
        })
        
        result = {
            "success": True,
            "points_awarded": points_awarded,
            "badges_earned": [mission.get("rewards", {}).get("badge")],
            "level_up": False,
            "new_level": 1
        }
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leaderboard")
async def get_leaderboard(limit: int = Query(100), offset: int = Query(0)):
    """
    Get global leaderboard
    """
    try:
        # Get top users from Redis sorted set
        top_users = redis_client.zrevrange(
            "leaderboard:global",
            offset,
            offset + limit - 1,
            withscores=True
        )
        
        leaderboard = []
        for rank, (user_id, score) in enumerate(top_users, start=offset + 1):
            leaderboard.append({
                "rank": rank,
                "user_id": user_id,
                "points": int(score)
            })
        
        return {"leaderboard": leaderboard, "offset": offset, "limit": limit}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leaderboard/with-users")
async def get_leaderboard_with_users(limit: int = Query(100), offset: int = Query(0)):
    """
    Get leaderboard with user details (requires user service integration)
    """
    try:
        # Get top users from Redis
        top_users = redis_client.zrevrange(
            "leaderboard:global",
            offset,
            offset + limit - 1,
            withscores=True
        )
        
        # For now, return basic structure
        # In production, this would fetch user details from user service
        leaderboard = []
        for rank, (user_id, score) in enumerate(top_users, start=offset + 1):
            leaderboard.append({
                "rank": rank,
                "user_id": user_id,
                "name": f"User {user_id}",  # TODO: Fetch from user service
                "points": int(score),
                "level": 1,  # TODO: Fetch from user service
                "avatar": "👨‍🌾"  # TODO: Fetch from user service
            })
        
        return {"leaderboard": leaderboard, "offset": offset, "limit": limit}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/badges/{user_id}")
async def get_user_badges(user_id: str):
    """
    Get all badges earned by a user
    """
    try:
        # Initialize sample achievements if needed
        await initialize_achievements()
        
        # Get user's badges from MongoDB
        cursor = achievements_collection.find({"user_id": user_id})
        badges = await cursor.to_list(length=100)
        
        # Format badges
        result_badges = []
        for badge in badges:
            result_badges.append({
                "id": badge.get("id"),
                "title": badge.get("title"),
                "description": badge.get("description"),
                "icon": badge.get("icon", "🏆"),
                "points": badge.get("points", 0),
                "earned_at": badge.get("earned_at"),
                "rarity": badge.get("rarity", "common")
            })
        
        return {"badges": result_badges}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recent-achievements")
async def get_recent_achievements(limit: int = Query(10)):
    """
    Get recent achievements across all users
    """
    try:
        await initialize_achievements()
        
        cursor = achievements_collection.find().sort("earned_at", -1).limit(limit)
        achievements = await cursor.to_list(length=limit)
        
        result = []
        for ach in achievements:
            result.append({
                "id": ach.get("id"),
                "title": ach.get("title"),
                "description": ach.get("description"),
                "icon": ach.get("icon", "🏆"),
                "points": ach.get("points", 0),
                "user_id": ach.get("user_id"),
                "earned_at": ach.get("earned_at"),
                "rarity": ach.get("rarity", "common")
            })
        
        return {"achievements": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def initialize_achievements():
    count = await achievements_collection.count_documents({})
    if count == 0:
        # Sample achievements would be added here
        pass

@app.get("/api/missions/stats")
async def get_mission_stats():
    """
    Get mission statistics for dashboard
    """
    try:
        total_missions = await missions_collection.count_documents({})
        active_missions = await missions_collection.count_documents({"active": True})
        
        # Get total completions
        total_completions = await db.mission_completions.count_documents({})
        
        return {
            "total_missions": total_missions,
            "active_missions": active_missions,
            "total_completions": total_completions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002)
