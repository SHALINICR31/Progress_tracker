from flask import Blueprint, request, jsonify
import uuid, datetime
from storage import read_tasks, write_tasks
from middleware import token_required

tasks_bp = Blueprint('tasks', __name__)

def today():
    return datetime.datetime.utcnow().date().isoformat()

def recalc(task):
    subs = task.get('subtasks', [])
    if not subs:
        task['progress'] = 100 if task.get('completed') else 0
    else:
        done = sum(1 for s in subs if s.get('completed'))
        task['progress'] = round(done / len(subs) * 100)
    return task

def stamp_calendar(task):
    d   = today()
    cal = task.setdefault('calendar', {})
    p   = task.get('progress', 0)
    cal[d] = 'done' if p == 100 else ('partial' if p > 0 else 'none')
    return task

def user_tasks(uid):
    return [t for t in read_tasks() if t['user_id'] == uid]

# ── GET all ────────────────────────────────────────────────
@tasks_bp.route('/', methods=['GET'])
@token_required
def get_tasks():
    return jsonify(user_tasks(request.user_id)), 200

# ── GET stats ──────────────────────────────────────────────
@tasks_bp.route('/stats', methods=['GET'])
@token_required
def stats():
    tasks = user_tasks(request.user_id)
    total = len(tasks)
    done  = sum(1 for t in tasks if t.get('progress', 0) == 100)
    ovr   = round(sum(t.get('progress', 0) for t in tasks) / total) if total else 0
    return jsonify({'total': total, 'completed': done, 'overall_progress': ovr}), 200

# ── POST create ────────────────────────────────────────────
@tasks_bp.route('/', methods=['POST'])
@token_required
def create_task():
    d = request.get_json()
    title = d.get('title', '').strip()
    if not title: return jsonify({'error': 'Title required'}), 400
    task = {
        'id':          str(uuid.uuid4()),
        'user_id':     request.user_id,
        'title':       title,
        'description': d.get('description', ''),
        'color':       d.get('color', '#2d6a4f'),
        'start_date':  d.get('start_date', ''),
        'due_date':    d.get('due_date', ''),
        'completed':   False,
        'progress':    0,
        'subtasks':    [],
        'calendar':    {},
        'created_at':  datetime.datetime.utcnow().isoformat()
    }
    all_tasks = read_tasks()
    all_tasks.append(task)
    write_tasks(all_tasks)
    return jsonify(task), 201

# ── PUT update task ────────────────────────────────────────
@tasks_bp.route('/<tid>', methods=['PUT'])
@token_required
def update_task(tid):
    all_tasks = read_tasks()
    task = next((t for t in all_tasks if t['id'] == tid and t['user_id'] == request.user_id), None)
    if not task: return jsonify({'error': 'Not found'}), 404
    d = request.get_json()
    for f in ['title', 'description', 'color', 'completed', 'start_date', 'due_date']:
        if f in d: task[f] = d[f]
    recalc(task); stamp_calendar(task)
    write_tasks(all_tasks)
    return jsonify(task), 200

# ── DELETE task ────────────────────────────────────────────
@tasks_bp.route('/<tid>', methods=['DELETE'])
@token_required
def delete_task(tid):
    all_tasks = read_tasks()
    new = [t for t in all_tasks if not (t['id'] == tid and t['user_id'] == request.user_id)]
    if len(new) == len(all_tasks): return jsonify({'error': 'Not found'}), 404
    write_tasks(new)
    return jsonify({'message': 'deleted'}), 200

# ── POST subtask ───────────────────────────────────────────
@tasks_bp.route('/<tid>/subtasks', methods=['POST'])
@token_required
def add_subtask(tid):
    all_tasks = read_tasks()
    task = next((t for t in all_tasks if t['id'] == tid and t['user_id'] == request.user_id), None)
    if not task: return jsonify({'error': 'Not found'}), 404
    title = request.get_json().get('title', '').strip()
    if not title: return jsonify({'error': 'Title required'}), 400
    sub = {'id': str(uuid.uuid4()), 'title': title, 'completed': False,
           'created_at': datetime.datetime.utcnow().isoformat()}
    task.setdefault('subtasks', []).append(sub)
    recalc(task); stamp_calendar(task)
    write_tasks(all_tasks)
    return jsonify(task), 201

# ── PUT subtask ────────────────────────────────────────────
@tasks_bp.route('/<tid>/subtasks/<sid>', methods=['PUT'])
@token_required
def update_subtask(tid, sid):
    all_tasks = read_tasks()
    task = next((t for t in all_tasks if t['id'] == tid and t['user_id'] == request.user_id), None)
    if not task: return jsonify({'error': 'Not found'}), 404
    sub = next((s for s in task.get('subtasks', []) if s['id'] == sid), None)
    if not sub: return jsonify({'error': 'Subtask not found'}), 404
    d = request.get_json()
    for f in ['title', 'completed']:
        if f in d: sub[f] = d[f]
    recalc(task); stamp_calendar(task)
    write_tasks(all_tasks)
    return jsonify(task), 200

# ── DELETE subtask ─────────────────────────────────────────
@tasks_bp.route('/<tid>/subtasks/<sid>', methods=['DELETE'])
@token_required
def delete_subtask(tid, sid):
    all_tasks = read_tasks()
    task = next((t for t in all_tasks if t['id'] == tid and t['user_id'] == request.user_id), None)
    if not task: return jsonify({'error': 'Not found'}), 404
    task['subtasks'] = [s for s in task.get('subtasks', []) if s['id'] != sid]
    recalc(task); stamp_calendar(task)
    write_tasks(all_tasks)
    return jsonify(task), 200
