import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../utils/api';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import s from './TasksPage.module.css';

export default function TasksPage() {
  const { refreshStats } = useOutletContext();
  const [tasks,   setTasks]   = useState([]);
  const [stats,   setStats]   = useState({ total:0, completed:0, overall_progress:0 });
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all'); // all | active | done | overdue

  const fetchAll = useCallback(async () => {
    try {
      const [tr, sr] = await Promise.all([api.get('/tasks/'), api.get('/tasks/stats')]);
      setTasks(tr.data);
      setStats(sr.data);
      refreshStats();
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [refreshStats]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const today = new Date().toISOString().split('T')[0];

  const filtered = tasks
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter(t => {
      if (filter === 'all')     return true;
      if (filter === 'active')  return t.progress < 100;
      if (filter === 'done')    return t.progress === 100;
      if (filter === 'overdue') return t.due_date && t.due_date < today && t.progress < 100;
      return true;
    })
    .sort((a, b) => {
      // Overdue first, then by due date, then by creation
      const aOver = a.due_date && a.due_date < today && a.progress < 100;
      const bOver = b.due_date && b.due_date < today && b.progress < 100;
      if (aOver && !bOver) return -1;
      if (!aOver && bOver) return  1;
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
      if (a.due_date) return -1;
      if (b.due_date) return  1;
      return 0;
    });

  const overdue = tasks.filter(t => t.due_date && t.due_date < today && t.progress < 100).length;

  if (loading) return (
    <div className={s.loadWrap}><div className={s.spinner} /></div>
  );

  return (
    <div className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <div>
          <h2 className={s.title}>My Tasks</h2>
          <p className={s.date}>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
        </div>
        <button className={s.addBtn} onClick={() => setShowAdd(true)}>＋ New Task</button>
      </header>

      {/* Stats bar */}
      <div className={s.statsBar}>
        <div className={s.statPill}>
          <span className={s.statNum}>{stats.total}</span>
          <span className={s.statLbl}>Total</span>
        </div>
        <div className={s.statPill}>
          <span className={s.statNum} style={{color:'var(--green)'}}>{stats.completed}</span>
          <span className={s.statLbl}>Done</span>
        </div>
        <div className={s.statPill}>
          <span className={s.statNum} style={{color:'var(--amber)'}}>{stats.total - stats.completed}</span>
          <span className={s.statLbl}>In Progress</span>
        </div>
        {overdue > 0 && (
          <div className={s.statPill}>
            <span className={s.statNum} style={{color:'var(--red)'}}>{overdue}</span>
            <span className={s.statLbl}>Overdue</span>
          </div>
        )}
        <div className={s.statPill} style={{marginLeft:'auto'}}>
          <span className={s.statNum} style={{color:'var(--accent)'}}>{stats.overall_progress}%</span>
          <span className={s.statLbl}>Overall</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className={s.masterBar}>
        <div className={s.masterFill} style={{width:`${stats.overall_progress}%`}} />
      </div>

      {/* Filters & Search */}
      <div className={s.controls}>
        <input
          className={s.search}
          placeholder="🔍  Search tasks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={s.filters}>
          {['all','active','done','overdue'].map(f => (
            <button key={f}
              className={`${s.filterBtn} ${filter===f ? s.filterActive : ''}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {filtered.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIcon}>📭</div>
          <p>{search ? 'No tasks match your search.' : filter !== 'all' ? `No ${filter} tasks.` : 'No tasks yet — add your first one!'}</p>
        </div>
      ) : (
        <div className={s.grid}>
          {filtered.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              delay={i * 0.05}
              onDelete={async id => { await api.delete(`/tasks/${id}`); fetchAll(); }}
              onUpdate={async (id, d) => { await api.put(`/tasks/${id}`, d); fetchAll(); }}
              onAddSubtask={async (tid, title) => { await api.post(`/tasks/${tid}/subtasks`, { title }); fetchAll(); }}
              onToggleSub={async (tid, sid, completed) => { await api.put(`/tasks/${tid}/subtasks/${sid}`, { completed }); fetchAll(); }}
              onDeleteSub={async (tid, sid) => { await api.delete(`/tasks/${tid}/subtasks/${sid}`); fetchAll(); }}
              onRenameSub={async (tid, sid, title) => { await api.put(`/tasks/${tid}/subtasks/${sid}`, { title }); fetchAll(); }}
            />
          ))}
        </div>
      )}

      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} onAdd={async p => { await api.post('/tasks/', p); setShowAdd(false); fetchAll(); }} />}
    </div>
  );
}
