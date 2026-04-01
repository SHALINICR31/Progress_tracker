import React, { useState } from 'react';
import s from './AddTaskModal.module.css';

const COLORS = ['#4ecdc4','#ffd166','#ff6b6b','#a78bfa','#06d6a0','#f97316','#3b82f6','#ec4899'];

export default function AddTaskModal({ onClose, onAdd }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    title: '', description: '', color: COLORS[0],
    start_date: today, due_date: ''
  });
  const [busy, setBusy] = useState(false);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    await onAdd({ ...form, title: form.title.trim() });
    setBusy(false);
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <h3>New Task</h3>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className={s.form}>
          <div className={s.field}>
            <label>Task Title *</label>
            <input placeholder="What's the main goal?" value={form.title}
              onChange={e => f('title', e.target.value)} autoFocus required />
          </div>

          <div className={s.field}>
            <label>Description</label>
            <textarea placeholder="Optional details…" value={form.description}
              onChange={e => f('description', e.target.value)} rows={2} />
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label>Start Date</label>
              <input type="date" value={form.start_date}
                onChange={e => f('start_date', e.target.value)} />
            </div>
            <div className={s.field}>
              <label>Due Date</label>
              <input type="date" value={form.due_date}
                min={form.start_date || today}
                onChange={e => f('due_date', e.target.value)} />
            </div>
          </div>

          <div className={s.field}>
            <label>Card Color</label>
            <div className={s.colorRow}>
              {COLORS.map(c => (
                <button key={c} type="button"
                  className={`${s.colorDot} ${form.color===c ? s.colorActive:''}`}
                  style={{ background: c }}
                  onClick={() => f('color', c)} />
              ))}
            </div>
          </div>

          <div className={s.actions}>
            <button type="button" className={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={s.addBtn} disabled={busy}>
              {busy ? 'Creating…' : '＋ Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
