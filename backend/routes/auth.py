from flask import Blueprint, request, jsonify
import jwt, datetime

auth_bp = Blueprint('auth', __name__)

# 🔐 Secret key (for demo)
SECRET = 'taskflow-secret-2024'

# 🔑 Token generator
def make_token(uid, uname):
    return jwt.encode(
        {
            'user_id': uid,
            'username': uname,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        },
        SECRET,
        algorithm='HS256'
    )

# 🚀 REGISTER (optional - simple demo)
@auth_bp.route('/register', methods=['POST'])
def register():
    return jsonify({
        "message": "Register disabled for demo"
    }), 200

# 🔥 LOGIN (HARDCODED - NO ERROR)
@auth_bp.route('/login', methods=['POST'])
def login():
    d = request.get_json()

    # safety check
    if not d:
        return jsonify({'error': 'No data provided'}), 400

    u = d.get('username', '').strip()
    p = d.get('password', '')

    # ✅ Hardcoded credentials
    if u == "shalini" and p == "1234":
        return jsonify({
            'token': make_token("1", u),
            'username': u,
            'user_id': "1"
        }), 200

    return jsonify({'error': 'Invalid credentials'}), 401
