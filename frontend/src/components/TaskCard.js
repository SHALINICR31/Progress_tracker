import React, { useState } from 'react';
import CalendarHeatmap from './CalendarHeatmap';
import s from './TaskCard.module.css';

const COLORS = ['#4ecdc4','#ffd166','#ff6b6b','#a78bfa','#06d6a0','#f97316','#3b82f6','#ec4899'];

export default function TaskCard({ task, delay, onDelete, onUpdate, onAddSubtask, onToggleSub, onDeleteSub, onRenameSub }) {
  const [open,      setOpen]      = useState(true);
  const [showCal,   setShowCal]   = useState(false);
  const [addingVal, setAddingVal] = useState('');
  const [adding,    setAdding]    = useState(false);
  const [editSubId, setEditSubId] = useState(null);
  const [editSubVal,setEditSubVal]= useState('');
  const [editMain,  setEditMain]  = useState(false);
  const [mainTitle, setMainTitle] = useState(task.title);
  const [editDates, setEditDates] = useState(false);
  const [startDate, setStartDate] = useState(task.start_date || '');
  const [dueDate,   setDueDate]   = useState(task.due_date   || '');

  const today     = new Date().toISOString().split('T')[0];
  const subtasks  = task.subtasks ?? [];
  const doneCount = subtasks.filter(s => s.completed).length;
  const progress  = task.progress ?? 0;
  const isOverdue = task.due_date && task.due_date < today && progress < 100;
  const isDueSoon = task.due_date && task.due_date >= today &&
    new Date(task.due_date) - new Date(today) <= 2 * 86400000 && progress < 100;

  const barColor = progress === 100 ? 'var(--green)'
    : isOverdue ? 'var(--red)'
    : isDueSoon ? 'var(--amber)'
    : 'var(--accent)';

  const saveMainTitle = async () => {
    if (mainTitle.trim() && mainTitle.trim() !== task.title)
      await onUpdate(task.id, { title: mainTitle.trim() });
    setEditMain(false);
  };

  const saveDates = async () => {
    await onUpdate(task.id, { start_date: startDate, due_date: dueDate });
    setEditDates(false);
  };

  const submitSub = async e => {
    e.preventDefault();
    if (!addingVal.trim()) return;
    await onAddSubtask(task.id, addingVal.trim());
    setAddingVal(''); setAdding(false);
  };

  const saveSubEdit = async subId => {
    if (editSubVal.trim()) await onRenameSub(task.id, subId, editSubVal.trim());
    setEditSubId(null);
  };

  const daysUntilDue = task.due_date
    ? Math.ceil((new Date(task.due_date) - new Date(today)) / 86400000)
    : null;

  return (
    <div className={s.card} style={{ '--task-color': task.color || 'var(--accent)', animationDelay: `${delay}s`, animationName: 'fadeUp' }}>
      <div className={s.colorStripe} style={{ background: task.color || 'var(--accent)' }} />

      {/* ── Header ── */}
      <div className={s.header}>
        <div className={s.titleWrap}>
          {editMain ? (
            <input className={s.titleInput} value={mainTitle}
              onChange={e => setMainTitle(e.target.value)}
              onBlur={saveMainTitle}
              onKeyDown={e => { if (e.key==='Enter') saveMainTitle(); if (e.key==='Escape'){ setMainTitle(task.title); setEditMain(false); } }}
              autoFocus />
          ) : (
            <h3 className={s.title} onDoubleClick={() => setEditMain(true)}>{task.title}</h3>
          )}
          <div className={s.badges}>
            {isOverdue  && <span className={s.badgeRed}>⚠ Overdue</span>}
            {isDueSoon  && !isOverdue && <span className={s.badgeAmber}>⏰ Due soon</span>}
            {progress === 100 && <span className={s.badgeGreen}>✓ Done</span>}
          </div>
        </div>
        <div className={s.headerBtns}>
          <button className={s.iconBtn} onClick={() => setShowCal(v=>!v)} title="Heatmap">📊</button>
          <button className={s.iconBtn} onClick={() => setOpen(v=>!v)}>{open?'▲':'▼'}</button>
          <button className={`${s.iconBtn} ${s.delBtn}`} onClick={() => onDelete(task.id)}>✕</button>
        </div>
      </div>

      {/* ── Date range ── */}
      <div className={s.dateRow}>
        {editDates ? (
          <div className={s.dateEditRow}>
            <div className={s.dateField}>
              <label>Start</label>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
            </div>
            <div className={s.dateField}>
              <label>Due</label>
              <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
            </div>
            <button className={s.saveDatesBtn} onClick={saveDates}>Save</button>
            <button className={s.cancelDatesBtn} onClick={()=>setEditDates(false)}>✕</button>
          </div>
        ) : (
          <div className={s.datePills} onClick={() => setEditDates(true)} title="Click to edit dates">
            {task.start_date
              ? <span className={s.datePill}>🗓 {fmtDate(task.start_date)}</span>
              : <span className={s.datePillEmpty}>+ Start date</span>}
            {task.start_date && task.due_date && <span className={s.dateArrow}>→</span>}
            {task.due_date
              ? <span className={`${s.datePill} ${isOverdue ? s.datePillRed : isDueSoon ? s.datePillAmber : ''}`}>
                  🏁 {fmtDate(task.due_date)}
                  {daysUntilDue !== null && progress < 100 &&
                    <span className={s.daysLeft}>
                      {daysUntilDue < 0 ? ` (${Math.abs(daysUntilDue)}d late)` : daysUntilDue === 0 ? ' (today)' : ` (${daysUntilDue}d)`}
                    </span>}
                </span>
              : <span className={s.datePillEmpty}>+ Due date</span>}
          </div>
        )}
      </div>

      {/* ── Progress ── */}
      <div className={s.progressSection}>
        <div className={s.progressTop}>
          <span className={s.progressLabel}>{doneCount}/{subtasks.length} subtasks</span>
          <span className={s.progressPct} style={{ color: barColor }}>{progress}%</span>
        </div>
        <div className={s.bar}>
          <div className={s.fill} style={{ width:`${progress}%`, background: barColor }} />
        </div>
      </div>

      {/* ── Heatmap ── */}
      {showCal && (
        <div className={s.calWrap}>
          <CalendarHeatmap calendar={task.calendar || {}} />
        </div>
      )}

      {/* ── Subtasks ── */}
      {open && (
        <div className={s.subtasks}>
          {subtasks.length === 0 && !adding && (
            <p className={s.noSubs}>No subtasks yet.</p>
          )}
          {subtasks.map((sub, i) => (
            <div key={sub.id} className={`${s.subRow} ${sub.completed ? s.subDone : ''}`}
              style={{ animationDelay:`${i*.04}s`, animationName:'slideRight' }}>
              <button
                className={`${s.subCheck} ${sub.completed ? s.checked : ''}`}
                onClick={() => onToggleSub(task.id, sub.id, !sub.completed)}>
                {sub.completed && <span className={s.checkMark}>✓</span>}
              </button>
              {editSubId === sub.id ? (
                <input className={s.subEditInput} value={editSubVal}
                  onChange={e => setEditSubVal(e.target.value)}
                  onBlur={() => saveSubEdit(sub.id)}
                  onKeyDown={e => { if (e.key==='Enter') saveSubEdit(sub.id); if(e.key==='Escape') setEditSubId(null); }}
                  autoFocus />
              ) : (
                <span className={s.subTitle} onDoubleClick={() => { setEditSubId(sub.id); setEditSubVal(sub.title); }}>
                  {sub.title}
                </span>
              )}
              <button className={s.subDelBtn} onClick={() => onDeleteSub(task.id, sub.id)}>✕</button>
            </div>
          ))}

          {adding ? (
            <form onSubmit={submitSub} className={s.addSubForm}>
              <input className={s.addSubInput} placeholder="Subtask title…" value={addingVal}
                onChange={e => setAddingVal(e.target.value)} autoFocus />
              <button type="submit" className={s.addSubSave}>Add</button>
              <button type="button" className={s.addSubCancel} onClick={()=>{setAdding(false);setAddingVal('');}}>✕</button>
            </form>
          ) : (
            <button className={s.addSubTrigger} onClick={() => setAdding(true)}>＋ Add subtask</button>
          )}
        </div>
      )}

      {/* ── Color picker ── */}
      <div className={s.colorBar}>
        {COLORS.map(c => (
          <button key={c}
            className={`${s.colorDot} ${task.color===c ? s.colorActive:''}`}
            style={{ background:c }}
            onClick={() => onUpdate(task.id, { color: c })}
          />
        ))}
      </div>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'2-digit' });
}
