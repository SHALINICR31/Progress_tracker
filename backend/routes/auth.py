from flask import Blueprint, request, jsonify
import jwt, datetime

auth_bp = Blueprint('auth', __name__)
SECRET  = 'taskflow_super_secure_key_987654'

def make_token(uid, uname):
    return jwt.encode(
        {'user_id': uid, 'username': uname,
         'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)},
        SECRET, algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    return jsonify({'error': 'Registration is disabled'}), 403

@auth_bp.route('/login', methods=['POST'])
def login():
    d = request.get_json()
    if not d:
        return jsonify({'error': 'No data provided'}), 400
    u = d.get('username', '').strip()
    p = d.get('password', '')
    if u == "shalini" and p == "123456":
        return jsonify({
            'token': make_token("1", u),
            'username': u,
            'user_id': "1"
        }), 200
    return jsonify({'error': 'Invalid credentials'}), 401
