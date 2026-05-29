from app import app
from models import db, User, Course
import werkzeug.security as ws

def seed_database():
    print("Initializing database seeding...")
    
    # 1. Clear out any existing data to prevent duplicate errors
    db.drop_all()
    db.create_all()
    
    # 2. Create encrypted passwords
    hashed_password = ws.generate_password_hash("password123")
    
    # 3. Create Sample Users 
    instructor_1 = User(
        username="Alex_Instructor", 
        email="alex@skillforge.com", 
        password_hash=hashed_password, 
        role="instructor"
    )
    student_1 = User(
        username="John_Doe", 
        email="john@student.com", 
        password_hash=hashed_password, 
        role="student"
    )
    student_2 = User(
        username="Jane_Smith", 
        email="jane@student.com", 
        password_hash=hashed_password, 
        role="student"
    )
    
    db.session.add_all([instructor_1, student_1, student_2])
    db.session.commit() 
    
    # 4. Create Sample Courses (One-to-Many Relationship)
    course_1 = Course(
        title="Full-Stack Web Engineering", 
        description="Master React, Flask, and database relationship architecture.", 
        instructor_id=instructor_1.id
    )
    course_2 = Course(
        title="Database Systems & Architecture", 
        description="Deep dive into relational modeling, SQL keys, and table mapping.", 
        instructor_id=instructor_1.id
    )
    
    db.session.add_all([course_1, course_2])
    db.session.commit()

    # Attaching courses directly to the student relationships
    student_1.enrolled_courses.append(course_1)
    student_1.enrolled_courses.append(course_2)
    student_2.enrolled_courses.append(course_1)
    
    db.session.commit()
    print("Database successfully seeded with test accounts and courses.")

if __name__ == '__main__':
    with app.app_context():
        seed_database()
