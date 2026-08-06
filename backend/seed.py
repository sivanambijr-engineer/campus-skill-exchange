import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, Skill, Swap, Message, Review
from app.services.auth_service import get_password_hash

def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("🌱 Seeding Campus Skill Exchange FastAPI Database...")

    # Users
    u1 = User(
        id="usr_001",
        email="sivan@stanford.edu",
        password_hash=get_password_hash("password123"),
        full_name="Sivan Ambi",
        campus_name="Stanford University",
        major="Computer Science (Senior)",
        bio="Building AI tools by day, practicing acoustic guitar by night. Passionate about peer learning!",
        reputation_score=4.9,
        karma_points=340,
        swaps_completed=14,
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
    )

    u2 = User(
        id="usr_002",
        email="elena@stanford.edu",
        password_hash=get_password_hash("password123"),
        full_name="Elena Rostova",
        campus_name="Stanford University",
        major="Linguistics & Spanish Lit (Junior)",
        bio="Native Spanish speaker and acoustic guitarist of 8 years. Excited to exchange skills for coding help!",
        reputation_score=4.95,
        karma_points=510,
        swaps_completed=22,
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250"
    )

    u3 = User(
        id="usr_003",
        email="marcus@stanford.edu",
        password_hash=get_password_hash("password123"),
        full_name="Marcus Vance",
        campus_name="Stanford University",
        major="Music Production (Senior)",
        bio="Producer and audio engineer. Love teaching music theory and mixing in Ableton Live.",
        reputation_score=4.8,
        karma_points=280,
        swaps_completed=9,
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
    )

    db.add_all([u1, u2, u3])
    db.commit()

    # Skills
    s1 = Skill(user_id="usr_001", name="Python & Data Science", category="Programming", type="OFFERED", proficiency="Expert", description="Pandas, NumPy, Machine Learning basics")
    s2 = Skill(user_id="usr_001", name="Conversational Spanish", category="Languages", type="DESIRED", proficiency="Intermediate", description="Looking for weekly casual speaking sessions")
    
    s3 = Skill(user_id="usr_002", name="Conversational Spanish", category="Languages", type="OFFERED", proficiency="Expert", description="Native fluency, grammar tips, and accent practice")
    s4 = Skill(user_id="usr_002", name="Python & Data Science", category="Programming", type="DESIRED", proficiency="Beginner", description="Wants to automate text analysis")

    s5 = Skill(user_id="usr_003", name="Music Production & Mixing", category="Music", type="OFFERED", proficiency="Expert", description="Ableton Live, beat making, EQing")
    s6 = Skill(user_id="usr_003", name="Full-Stack Web Dev", category="Programming", type="DESIRED", proficiency="Beginner", description="Wants to create portfolio app")

    db.add_all([s1, s2, s3, s4, s5, s6])
    db.commit()

    # Swap
    swap1 = Swap(
        id="swap_101",
        requester_id="usr_001",
        recipient_id="usr_002",
        offered_skill="Python & Data Science",
        desired_skill="Conversational Spanish",
        status="ACCEPTED",
        meeting_type="IN_PERSON",
        meeting_location="Green Library 2nd Floor",
        proposed_time="Tomorrow at 4:00 PM",
        match_score=98
    )
    db.add(swap1)
    db.commit()

    # Messages
    m1 = Message(swap_id="swap_101", sender_id="usr_002", sender_name="Elena Rostova", content="Hey Sivan! Super excited about this swap.")
    m2 = Message(swap_id="swap_101", sender_id="usr_001", sender_name="Sivan Ambi", content="Hi Elena! Looking forward to practicing Spanish!")
    db.add_all([m1, m2])

    # Review
    r1 = Review(
        swap_id="swap_101",
        reviewer_id="usr_002",
        reviewer_name="Elena Rostova",
        reviewer_avatar="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
        reviewee_id="usr_001",
        rating=5,
        comment="Outstanding tutor! Structured approach to teaching Python data science."
    )
    db.add(r1)

    db.commit()
    db.close()
    print("✅ Seeded database successfully!")

if __name__ == "__main__":
    seed()
