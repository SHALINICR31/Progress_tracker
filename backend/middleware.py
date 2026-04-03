import jwt
from flask import request, jsonify
from functools import wraps

SECRET = 'taskflow_super_secure_key_987654'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return jsonify({'error': 'Token missing'}), 401
        try:
            data = jwt.decode(auth.split(' ')[1], SECRET, algorithms=['HS256'])
            request.user_id  = data['user_id']
            request.username = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated
