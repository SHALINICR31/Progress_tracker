import json, os, threading

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

USERS_FILE   = os.path.join(DATA_DIR, 'users.json')
TASKS_FILE   = os.path.join(DATA_DIR, 'tasks.json')
JOURNAL_FILE = os.path.join(DATA_DIR, 'journal.json')

_lock = threading.Lock()

def _read(fp):
    with _lock:
        if not os.path.exists(fp): return []
        with open(fp) as f:
            try: return json.load(f)
            except: return []

def _write(fp, data):
    with _lock:
        with open(fp, 'w') as f:
            json.dump(data, f, indent=2, default=str)

def read_users():    return _read(USERS_FILE)
def write_users(d):  _write(USERS_FILE, d)
def read_tasks():    return _read(TASKS_FILE)
def write_tasks(d):  _write(TASKS_FILE, d)
def read_journal():  return _read(JOURNAL_FILE)
def write_journal(d): _write(JOURNAL_FILE, d)
