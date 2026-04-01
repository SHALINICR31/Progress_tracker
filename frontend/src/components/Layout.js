import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import s from './Layout.module.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, completed: 0, overall_progress: 0 });

  useEffect(() => {
    api.get('/tasks/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={s.shell}>
      {/* ── Sidebar ── */}
      <aside className={s.sidebar}>
        <div className={s.brand}>
          <div className={s.brandMark}>✦</div>
          <span className={s.brandName}>TaskFlow</span>
        </div>

        <div className={s.userCard}>
          <div className={s.avatar}>{user.username[0].toUpperCase()}</div>
          <div className={s.userMeta}>
            <div className={s.userName}>{user.username}</div>
            <div className={s.userRole}>Task Tracker</div>
          </div>
        </div>

        {/* Circular overall progress */}
        <div className={s.ringWrap}>
          <ProgressRing progress={stats.overall_progress} />
          <div className={s.ringStats}>
            <span className={s.ringLabel}>Overall Progress</span>
            <span className={s.ringDetail}>{stats.completed}/{stats.total} tasks done</span>
          </div>
        </div>

        {/* Nav */}
        <nav className={s.nav}>
          <NavLink to="/" end className={({ isActive }) => `${s.navItem} ${isActive ? s.navActive : ''}`}>
            <span className={s.navIcon}>📋</span>
            <span>My Tasks</span>
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `${s.navItem} ${isActive ? s.navActive : ''}`}>
            <span className={s.navIcon}>📅</span>
            <span>Calendar</span>
          </NavLink>
        </nav>

        <button className={s.logoutBtn} onClick={handleLogout}>
          <span>←</span> Log out
        </button>
      </aside>

      {/* ── Content ── */}
      <div className={s.content}>
        <Outlet context={{ refreshStats: () => api.get('/tasks/stats').then(r => setStats(r.data)) }} />
      </div>
    </div>
  );
}

function ProgressRing({ progress }) {
  const r = 30, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  const fill = circ * (Math.min(progress, 100) / 100);
  const color = progress === 100 ? 'var(--green)' : progress >= 60 ? 'var(--accent)' : 'var(--amber)';
  return (
    <div className={s.ring}>
      <svg viewBox="0 0 72 72" width="64" height="64">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className={s.ringPct} style={{ color }}>{progress}%</div>
    </div>
  );
}
