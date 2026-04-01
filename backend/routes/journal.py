from flask import Blueprint, request, jsonify
import datetime
from storage import read_journal, write_journal
from middleware import token_required

journal_bp = Blueprint('journal', __name__)

def today():
    return datetime.datetime.utcnow().date().isoformat()

# ── GET all journal entries for user ───────────────────────
@journal_bp.route('/', methods=['GET'])
@token_required
def get_entries():
    journal = read_journal()
    entries = [e for e in journal if e['user_id'] == request.user_id]
    # Return as dict keyed by date for easy frontend lookup
    result = {}
    for e in entries:
        result[e['date']] = e
    return jsonify(result), 200

# ── POST / PUT upsert entry for a date ────────────────────
@journal_bp.route('/', methods=['POST'])
@token_required
def upsert_entry():
    d    = request.get_json()
    date = d.get('date', today())
    note = d.get('note', '').strip()
    mood = d.get('mood', '')   # optional emoji mood tag

    journal = read_journal()
    existing = next((e for e in journal
                     if e['user_id'] == request.user_id and e['date'] == date), None)
    if existing:
        existing['note']       = note
        existing['mood']       = mood
        existing['updated_at'] = datetime.datetime.utcnow().isoformat()
    else:
        journal.append({
            'user_id':    request.user_id,
            'date':       date,
            'note':       note,
            'mood':       mood,
            'created_at': datetime.datetime.utcnow().isoformat(),
            'updated_at': datetime.datetime.utcnow().isoformat()
        })
    write_journal(journal)
    return jsonify({'date': date, 'note': note, 'mood': mood}), 200

# ── DELETE entry ───────────────────────────────────────────
@journal_bp.route('/<date>', methods=['DELETE'])
@token_required
def delete_entry(date):
    journal = read_journal()
    new = [e for e in journal
           if not (e['user_id'] == request.user_id and e['date'] == date)]
    write_journal(new)
    return jsonify({'message': 'deleted'}), 200
