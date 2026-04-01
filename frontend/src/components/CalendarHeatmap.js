import React, { useMemo } from 'react';
import s from './CalendarHeatmap.module.css';

const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LBL = ['S','M','T','W','T','F','S'];

function buildDays(calendar) {
  const today = new Date(), days = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days.push({ key, status: calendar[key] || 'none', d });
  }
  return days;
}

function toWeeks(days) {
  const weeks = [];
  let week = [];
  const pad = days[0].d.getDay();
  for (let i = 0; i < pad; i++) week.push(null);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }
  return weeks;
}

export default function CalendarHeatmap({ calendar = {} }) {
  const { weeks, monthMarks } = useMemo(() => {
    const days  = buildDays(calendar);
    const weeks = toWeeks(days);
    const marks = [];
    let lastM = -1;
    weeks.forEach((wk, wi) => {
      wk.forEach(day => {
        if (day && day.d.getMonth() !== lastM) {
          lastM = day.d.getMonth();
          marks.push({ wi, label: MONTHS[lastM] });
        }
      });
    });
    return { weeks, monthMarks: marks };
  }, [calendar]);

  const doneDays   = Object.values(calendar).filter(v => v === 'done').length;
  const streak     = useMemo(() => {
    let c = 0;
    const t = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(t); d.setDate(t.getDate() - i);
      const k = d.toISOString().split('T')[0];
      if (calendar[k] === 'done') c++;
      else if (i > 0) break;
    }
    return c;
  }, [calendar]);

  return (
    <div className={s.wrap}>
      <div className={s.topRow}>
        <span className={s.label}>Activity Heatmap</span>
        <span className={s.meta}>{doneDays} days done · {streak}🔥 streak</span>
      </div>

      {/* Month labels */}
      <div className={s.monthRow} style={{ gridTemplateColumns: `repeat(${weeks.length}, 13px)` }}>
        {monthMarks.map((m, i) => (
          <span key={i} className={s.monthLabel} style={{ gridColumn: m.wi + 1 }}>{m.label}</span>
        ))}
      </div>

      <div className={s.gridOuter}>
        <div className={s.dayLabels}>
          {DAY_LBL.map((d, i) => <span key={i} className={s.dayLbl}>{i%2===1?d:''}</span>)}
        </div>
        <div className={s.grid}>
          {weeks.map((wk, wi) => (
            <div key={wi} className={s.col}>
              {wk.map((day, di) => (
                <div key={di}
                  className={`${s.cell} ${day ? s[day.status] : s.blank}`}
                  title={day ? `${day.key}: ${day.status}` : ''} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={s.legend}>
        <span className={s.legLbl}>Less</span>
        <div className={`${s.cell} ${s.none}`}    />
        <div className={`${s.cell} ${s.partial}`} />
        <div className={`${s.cell} ${s.done}`}    />
        <span className={s.legLbl}>More</span>
      </div>
    </div>
  );
}
