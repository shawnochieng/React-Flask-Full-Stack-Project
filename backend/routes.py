from flask import Blueprint, request, jsonify, current_app
from models import db, User, Course, PasswordResetToken
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import werkzeug.security as ws
from flask_mail import Message
from datetime import datetime

api = Blueprint('api', __name__)

# --- AUTHENTICATION ENDPOINTS ---
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400
    
    hashed_pwd = ws.generate_password_hash(data['password'])
    new_user = User(
        username=data['username'], 
        email=data['email'], 
        password_hash=hashed_pwd, 
        role=data.get('role', 'student')
    )
    db.session.add(new_user)
    db.session.commit()

    # Welcoming Notification Message
    try:
        import os
        from flask import current_app
        from app import mail, app
        msg = Message(
            "Welcome to SkillForge Academy!",
            recipients=[new_user.email],
            sender=current_app.config.get("MAIL_DEFAULT_SENDER")
        )
        msg.body = f"Hello {new_user.username},\n\nWelcome to your learning track. Your account as a {new_user.role} has been successfully created.\n\nHappy Coding!"
        mail.send(msg)
    except Exception as e:
        print(f"Mail delivery skipped or offline: {e}") # Prevents app failure if SMTP is unconfigured
        
        print("MAIL_USERNAME =", app.config.get("MAIL_USERNAME"))
        print("MAIL_DEFAULT_SENDER =", app.config.get("MAIL_DEFAULT_SENDER"))

    return jsonify({"message": "Registration successful"}), 201

# --- NEW: PROFILE MANIPULATION MANAGEMENT ROUTE ---
@api.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    # Check Username conflicts if it is being altered
    if 'username' in data and data['username'] != user.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already taken"}), 400
        user.username = data['username']

    # Update Password if provided
    if 'password' in data and data['password'].strip() != "":
        user.password_hash = ws.generate_password_hash(data['password'])

    db.session.commit()
    return jsonify({"message": "Profile updated successfully", "user": user.serialize()}), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and ws.check_password_hash(user.password_hash, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify({"token": token, "user": user.serialize()}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Stateless JWT logouts are handled on the frontend client by discarding the token
    return jsonify({"message": "Successfully logged out"}), 200

# --- COURSE CRUD ENGINE ---
@api.route('/courses', methods=['POST']) # CREATE
@jwt_required()
def create_course():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != 'instructor':
        return jsonify({"error": "Only instructors can create courses"}), 403
    
    data = request.get_json()
    course = Course(title=data['title'], description=data['description'], instructor_id=user.id)
    db.session.add(course)
    db.session.commit()
    return jsonify(course.serialize()), 201

@api.route('/courses', methods=['GET']) # READ ALL
def get_courses():
    courses = Course.query.all()
    return jsonify([c.serialize() for c in courses]), 200

@api.route('/courses/<int:id>', methods=['PUT']) # UPDATE
@jwt_required()
def update_course(id):
    user_id = get_jwt_identity()
    course = Course.query.get_or_404(id)
    if str(course.instructor_id) != str(user_id):
        return jsonify({"error": "Unauthorized manipulation"}), 403
    
    data = request.get_json()
    course.title = data.get('title', course.title)
    course.description = data.get('description', course.description)
    db.session.commit()
    return jsonify(course.serialize()), 200

@api.route('/courses/<int:id>', methods=['DELETE']) # DELETE
@jwt_required()
def delete_course(id):
    user_id = get_jwt_identity()
    course = Course.query.get_or_404(id)
    if str(course.instructor_id) != str(user_id):
        return jsonify({"error": "Unauthorized manipulation"}), 403
    
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course wiped away"}), 200
    
@api.route('/courses/<int:id>/enroll', methods=['POST'])
@jwt_required()
def enroll_in_course(id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    course = Course.query.get_or_404(id)
    
    if user.role != 'student':
        return jsonify({"error": "Only students can enroll in courses"}), 403
        
    # Check if already enrolled to prevent duplicates
    if course in user.enrolled_courses:
        return jsonify({"message": "Already enrolled in this course"}), 200
        
    user.enrolled_courses.append(course)
    db.session.commit()
    return jsonify({"message": "Successfully enrolled in course"}), 200

@api.route('/student/my-courses', methods=['GET'])
@jwt_required()
def get_my_courses():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify([c.serialize() for c in user.enrolled_courses]), 200

@api.route('/student/delete-account', methods=['DELETE'])
@jwt_required()
def delete_student_account():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    if user.role != 'student':
        return jsonify({"error": "Only student profiles can be self-purged"}), 403
    
    # Clean up Many-to-Many Enrollment Links first to prevent database locks
    user.enrolled_courses = []
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "User account successfully wiped away"}), 200

@api.route('/courses/<int:id>/unenroll', methods=['POST'])
@jwt_required()
def unenroll_from_course(id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    course = Course.query.get_or_404(id)
    
    if user.role != 'student':
        return jsonify({"error": "Only student accounts can unenroll from courses"}), 403
        
    if course in user.enrolled_courses:
        user.enrolled_courses.remove(course)
        db.session.commit()
        return jsonify({"message": "Successfully unenrolled from course"}), 200
        
    return jsonify({"error": "You are not enrolled in this course"}), 400

@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    # fail silently to prevent account email harvesting scans
    if not user:
        return jsonify({"message": "If that email exists, a reset link has been dispatched."}), 200

    # Clear prior active tokens, then issue a clean one
    PasswordResetToken.query.filter_by(user_id=user.id).delete()
    reset_record = PasswordResetToken(user_id=user.id)
    db.session.add(reset_record)
    db.session.commit()

    # Structure email body layout text
    try:
        import os
        from app import mail
        reset_link = f"http://localhost:5173/reset-password?token={reset_record.token}"
        
        msg = Message(
            "Reset Your SkillForge Password", 
            recipients=[user.email],
            sender=current_app.config.get("MAIL_DEFAULT_SENDER")
        )
        msg.body = f"Hello {user.username},\n\nA request was made to override your account login credentials. Use the secure single-action link below to configure your pass within 1 hour:\n\n{reset_link}\n\nIf you did not make this request, ignore this notification email."
        mail.send(msg)
    except Exception as e:
        print(f"SMTP notification failure layout: {e}")

    return jsonify({"message": "If that email exists, a reset link has been dispatched."}), 200

# 2. CONSUME SECURE TOKEN AND SUBMIT NEW PASSWORD
@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token_str = data.get('token')
    new_pwd = data.get('password')

    token_record = PasswordResetToken.query.filter_by(token=token_str).first()
    if not token_record or token_record.expires_at < datetime.utcnow():
        return jsonify({"error": "This security token has expired or is invalid."}), 400

    user = User.query.get(token_record.user_id)
    user.password_hash = ws.generate_password_hash(new_pwd)
    
    # Delete token to prevent multi-use replays
    db.session.delete(token_record)
    db.session.commit()

    return jsonify({"message": "Password updated successfully!"}), 200