from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True) # Nullable for Google Auth users
    google_id = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    campus_name = Column(String, default="Stanford University")
    major = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    profile_completed = Column(Boolean, default=False)
    reputation_score = Column(Float, default=5.0)
    karma_points = Column(Integer, default=100)
    swaps_completed = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    swaps_requested = relationship("Swap", foreign_keys="Swap.requester_id", back_populates="requester")
    swaps_received = relationship("Swap", foreign_keys="Swap.recipient_id", back_populates="recipient")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False) # OFFERED or DESIRED
    proficiency = Column(String, default="Intermediate")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="skills")

class Swap(Base):
    __tablename__ = "swaps"

    id = Column(String, primary_key=True, default=generate_uuid)
    requester_id = Column(String, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(String, ForeignKey("users.id"), nullable=False)
    offered_skill = Column(String, nullable=False)
    desired_skill = Column(String, nullable=False)
    status = Column(String, default="PENDING")
    meeting_type = Column(String, default="IN_PERSON")
    meeting_location = Column(String, nullable=True)
    proposed_time = Column(String, nullable=True)
    match_score = Column(Integer, default=85)
    created_at = Column(DateTime, default=datetime.utcnow)

    requester = relationship("User", foreign_keys="Swap.requester_id", back_populates="swaps_requested")
    recipient = relationship("User", foreign_keys="Swap.recipient_id", back_populates="swaps_received")
    messages = relationship("Message", back_populates="swap", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="swap", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    swap_id = Column(String, ForeignKey("swaps.id"), nullable=False)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    sender_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    swap = relationship("Swap", back_populates="messages")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    swap_id = Column(String, ForeignKey("swaps.id"), nullable=False)
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=False)
    reviewer_name = Column(String, nullable=False)
    reviewer_avatar = Column(String, nullable=True)
    reviewee_id = Column(String, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    swap = relationship("Swap", back_populates="reviews")
