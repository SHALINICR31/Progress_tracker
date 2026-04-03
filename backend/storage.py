import os, psycopg2, psycopg2.extras, json
from contextlib import contextmanager

DATABASE_URL = os.environ.get('DATABASE_URL')

@contextmanager
def get_conn():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

def init_db():
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                data JSONB NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                data JSONB NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS journal (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                data JSONB NOT NULL
            )
        """)

# ── USERS ──────────────────────────────────────────────
def read_users():
    with get_conn() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT data FROM users")
        return [row['data'] for row in cur.fetchall()]

def write_users(users):
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM users")
        for u in users:
            cur.execute(
                "INSERT INTO users (id, data) VALUES (%s, %s)",
                (u['id'], json.dumps(u))
            )

# ── TASKS ───────────────────────────────────────────────
def read_tasks():
    with get_conn() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT data FROM tasks")
        return [row['data'] for row in cur.fetchall()]

def write_tasks(tasks):
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM tasks")
        for t in tasks:
            cur.execute(
                "INSERT INTO tasks (id, user_id, data) VALUES (%s, %s, %s)",
                (t['id'], t.get('user_id', ''), json.dumps(t))
            )

# ── JOURNAL ─────────────────────────────────────────────
def read_journal():
    with get_conn() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT data FROM journal")
        return [row['data'] for row in cur.fetchall()]

def write_journal(entries):
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM journal")
        for e in entries:
            cur.execute(
                "INSERT INTO journal (id, user_id, data) VALUES (%s, %s, %s)",
                (e['id'], e.get('user_id', ''), json.dumps(e))
            )
