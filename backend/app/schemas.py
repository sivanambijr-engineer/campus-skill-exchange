from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# Auth & User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    campus_name: Optional[str] = "Stanford University"
    major: Optional[str] = None
    bio: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SkillSchema(BaseModel):
    id: str
    name: str
    category: str
    type: str # OFFERED or DESIRED
    proficiency: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None
    campus_name: str
    major: Optional[str] = None
    bio: Optional[str] = None
    reputation_score: float
    karma_points: int
    swaps_completed: int
    skills: List[SkillSchema] = []

    class Config:
        from_attributes = True

# Skill Schemas
class SkillCreate(BaseModel):
    name: str
    category: str
    type: str # OFFERED or DESIRED
    proficiency: str = "Intermediate"
    description: Optional[str] = None

# Swap Schemas
class SwapCreate(BaseModel):
    recipient_id: str
    offered_skill: str
    desired_skill: str
    meeting_type: str = "IN_PERSON"
    meeting_location: Optional[str] = None
    proposed_time: Optional[str] = None
    note: Optional[str] = None

class SwapStatusUpdate(BaseModel):
    status: str # ACCEPTED, REJECTED, COMPLETED, CANCELLED

class SwapResponse(BaseModel):
    id: str
    requester_id: str
    recipient_id: str
    offered_skill: str
    desired_skill: str
    status: str
    meeting_type: str
    meeting_location: Optional[str]
    proposed_time: Optional[str]
    match_score: int
    created_at: datetime

    class Config:
        from_attributes = True

# Message Schemas
class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: str
    swap_id: str
    sender_id: str
    sender_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# Review Schemas
class ReviewCreate(BaseModel):
    reviewee_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str

class ReviewResponse(BaseModel):
    id: str
    swap_id: str
    reviewer_id: str
    reviewer_name: str
    reviewer_avatar: Optional[str]
    reviewee_id: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True

# AI Match Schema
class AIMatchCandidate(BaseModel):
    user: UserResponse
    match_score: int
    reciprocal_details: dict
