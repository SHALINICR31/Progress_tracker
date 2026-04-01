import os
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.journal import journal_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'taskflow-secret-2024')

CORS(app, origins=[
    "http://localhost:3000",
    os.environ.get('REACT_APP_API_URL', '')
], supports_credentials=True)

app.register_blueprint(auth_bp,    url_prefix='/api/auth')
app.register_blueprint(tasks_bp,   url_prefix='/api/tasks')
app.register_blueprint(journal_bp, url_prefix='/api/journal')

@app.route('/api/health')
def health():
    return {'status': 'ok'}

if __name__ == '__main__':
    app.run(debug=False, port=5000)
