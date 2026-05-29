from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import secrets

db = SQLAlchemy()

# Many-to-Many Pivot Table: Students enrolled in Courses
enrollments = db.Table(
    'enrollments',
    db.Column('student_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('course_id', db.Integer, db.ForeignKey('courses.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="student") # student or instructor
    
    # One-to-Many Relationship: Instructor creates many Courses
    created_courses = db.relationship('Course', backref='instructor', lazy=True)
    
    # Many-to-Many Relationship: Student enrolls in many Courses
    enrolled_courses = db.relationship('Course', secondary=enrollments, backref='students', lazy='dynamic')

    def serialize(self):
        return {"id": self.id, "username": self.username, "email": self.email, "role": self.role}

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "instructor": self.instructor.username if self.instructor else "Unknown"
        }

class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(64), unique=True, nullable=False, default=lambda: secrets.token_hex(32))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(hours=1))
    user = db.relationship('User', backref=db.backref('reset_tokens', lazy='dynamic'))
