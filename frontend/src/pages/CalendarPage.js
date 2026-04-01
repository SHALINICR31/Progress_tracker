import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import s from './CalendarPage.module.css';

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const MOODS  = ['😊','😔','😤','🎯','💤','🔥','😰','🌟'];

export default function CalendarPage() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [tasks,     setTasks]     = useState([]);
  const [journal,   setJournal]   = useState({});  // { 'YYYY-MM-DD': { note, mood } }
  const [selected,  setSelected]  = useState(today.toISOString().split('T')[0]);
  const [noteText,  setNoteText]  = useState('');
  const [noteMood,  setNoteMood]  = useState('');
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [tr, jr] = await Promise.all([api.get('/tasks/'), api.get('/journal/')]);
      setTasks(tr.data);
      setJournal(jr.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // When selected date changes, populate note editor
  useEffect(() => {
    const entry = journal[selected];
    setNoteText(entry?.note || '');
    setNoteMood(entry?.mood || '');
  }, [selected, journal]);

  // Build calendar grid for current view month
  const buildGrid = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells.push({ day: d, dateStr });
    }
    return cells;
  };

  // Aggregate task status across all tasks for a given date
  const getDayStatus = (dateStr) => {
    let total = 0, done = 0;
    for (const task of tasks) {
      const cal = task.calendar || {};
      if (cal[dateStr]) {
        total++;
        if (cal[dateStr] === 'done') done++;
      }
    }
    if (total === 0) return 'none';
    if (done === total) return 'done';
    if (done > 0) return 'partial';
    return 'active';
  };

  const saveNote = async () => {
    if (!noteText.trim() && !noteMood) return;
    setSaving(true);
    try {
      await api.post('/journal/', { date: selected, note: noteText, mood: noteMood });
      await fetchData();
    } finally { setSaving(false); }
  };

  const deleteNote = async () => {
    await api.delete(`/journal/${selected}`);
    setNoteText(''); setNoteMood('');
    await fetchData();
  };

  // All journal entries sorted by date desc
  const journalEntries = Object.entries(journal)
    .filter(([, v]) => v.note || v.mood)
    .sort(([a], [b]) => b.localeCompare(a));

  const todayStr = today.toISOString().split('T')[0];
  const cells    = buildGrid();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
    else setViewMonth(m => m+1);
  };

  if (loading) return (
    <div className={s.loadWrap}><div className={s.spinner} /></div>
  );

  const selectedEntry = journal[selected];
  const selectedStatus = getDayStatus(selected);

  // Count tasks completed/total on selected day
  const selectedTaskStats = tasks.reduce((acc, task) => {
    const cal = task.calendar || {};
    if (cal[selected]) {
      acc.total++;
      if (cal[selected] === 'done') acc.done++;
    }
    return acc;
  }, { total: 0, done: 0 });

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <h2 className={s.title}>Calendar</h2>
          <p className={s.sub}>Track daily progress & write notes for any day</p>
        </div>
      </header>

      <div className={s.body}>
        {/* ── LEFT: Calendar ── */}
        <div className={s.calSection}>
          {/* Month nav */}
          <div className={s.monthNav}>
            <button className={s.navArrow} onClick={prevMonth}>‹</button>
            <h3 className={s.monthTitle}>{MONTHS[viewMonth]} {viewYear}</h3>
            <button className={s.navArrow} onClick={nextMonth}>›</button>
          </div>

          {/* Day labels */}
          <div className={s.dayRow}>
            {DAYS.map(d => <div key={d} className={s.dayLabel}>{d}</div>)}
          </div>

          {/* Calendar grid */}
          <div className={s.calGrid}>
            {cells.map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} className={s.emptyCell} />;
              const status = getDayStatus(cell.dateStr);
              const isToday    = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selected;
              const hasNote    = !!journal[cell.dateStr]?.note || !!journal[cell.dateStr]?.mood;
              const isFuture   = cell.dateStr > todayStr;

              return (
                <button
                  key={cell.dateStr}
                  className={[
                    s.dayCell,
                    isToday    ? s.isToday    : '',
                    isSelected ? s.isSelected : '',
                    isFuture   ? s.isFuture   : '',
                    status === 'done'    ? s.statusDone    : '',
                    status === 'partial' ? s.statusPartial : '',
                    status === 'active'  ? s.statusActive  : '',
                  ].join(' ')}
                  onClick={() => setSelected(cell.dateStr)}
                >
                  <span className={s.dayNum}>{cell.day}</span>
                  {hasNote && <span className={s.noteIndicator} title="Has note">●</span>}
                  {status === 'done' && !isSelected && <span className={s.doneCheck}>✓</span>}
                  {status === 'partial' && !isSelected && <span className={s.partialDot}>◐</span>}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className={s.legend}>
            <span className={s.legendItem}><span className={`${s.dot} ${s.lDone}`}/>Completed</span>
            <span className={s.legendItem}><span className={`${s.dot} ${s.lPartial}`}/>Partial</span>
            <span className={s.legendItem}><span className={`${s.dot} ${s.lNote}`}/>Has note</span>
          </div>

          {/* Selected day panel */}
          <div className={s.dayPanel}>
            <div className={s.dayPanelHeader}>
              <div>
                <span className={s.selectedDateLabel}>
                  {new Date(selected + 'T00:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
                </span>
                {isToday(selected, todayStr) && <span className={s.todayBadge}>Today</span>}
              </div>
              {selectedStatus !== 'none' && (
                <span className={`${s.statusBadge} ${s['badge_'+selectedStatus]}`}>
                  {selectedStatus === 'done' ? '✓ All done' : selectedStatus === 'partial' ? '◐ Partial' : 'Active'}
                </span>
              )}
            </div>

            {selectedTaskStats.total > 0 && (
              <div className={s.taskSummary}>
                <div className={s.tBar}>
                  <div className={s.tFill} style={{width:`${Math.round(selectedTaskStats.done/selectedTaskStats.total*100)}%`}} />
                </div>
                <span className={s.tLabel}>{selectedTaskStats.done}/{selectedTaskStats.total} tasks completed</span>
              </div>
            )}

            {/* Note editor */}
            <div className={s.noteEditor}>
              <div className={s.moodRow}>
                <span className={s.moodLabel}>Mood:</span>
                {MOODS.map(m => (
                  <button key={m} className={`${s.moodBtn} ${noteMood===m ? s.moodActive : ''}`}
                    onClick={() => setNoteMood(prev => prev===m ? '' : m)}>{m}</button>
                ))}
              </div>
              <textarea
                className={s.noteArea}
                placeholder={`Write a note for ${selected}… (What did you accomplish? Any blockers?)`}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                rows={4}
              />
              <div className={s.noteActions}>
                {selectedEntry && (selectedEntry.note || selectedEntry.mood) && (
                  <button className={s.deleteNoteBtn} onClick={deleteNote}>Delete note</button>
                )}
                <button className={s.saveNoteBtn} onClick={saveNote} disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save Note'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Notes feed ── */}
        <div className={s.feed}>
          <div className={s.feedHeader}>
            <h3 className={s.feedTitle}>All Notes</h3>
            <span className={s.feedCount}>{journalEntries.length} entries</span>
          </div>

          {journalEntries.length === 0 ? (
            <div className={s.feedEmpty}>
              <span className={s.feedEmptyIcon}>📝</span>
              <p>No notes yet. Click a day on the calendar to write your first note.</p>
            </div>
          ) : (
            <div className={s.feedList}>
              {journalEntries.map(([date, entry]) => {
                const status  = getDayStatus(date);
                const isSelDay = date === selected;
                return (
                  <button
                    key={date}
                    className={`${s.feedCard} ${isSelDay ? s.feedCardActive : ''}`}
                    onClick={() => {
                      // Navigate to that month if needed
                      const d = new Date(date + 'T00:00:00');
                      setViewYear(d.getFullYear());
                      setViewMonth(d.getMonth());
                      setSelected(date);
                    }}
                  >
                    <div className={s.feedCardTop}>
                      <div className={s.feedDateRow}>
                        <span className={`${s.feedDot} ${s['fdot_'+status]}`} />
                        <span className={s.feedDate}>
                          {new Date(date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                        </span>
                        {entry.mood && <span className={s.feedMood}>{entry.mood}</span>}
                      </div>
                      {status === 'done'    && <span className={s.feedStatusBadge} style={{background:'var(--green-dim)',color:'var(--green)'}}>✓ Done</span>}
                      {status === 'partial' && <span className={s.feedStatusBadge} style={{background:'var(--amber-dim)',color:'var(--amber)'}}>◐ Partial</span>}
                    </div>
                    {entry.note && <p className={s.feedNote}>{entry.note}</p>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function isToday(dateStr, todayStr) { return dateStr === todayStr; }
