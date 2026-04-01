import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import s from './Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ username:'', password:'' });
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.username, data.user_id); nav('/');
    } catch(ex) { setErr(ex.response?.data?.error || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.logo}><div className={s.logoMark}>✦</div><h1>TaskFlow</h1></div>
        <p className={s.sub}>Track tasks, build momentum daily.</p>
        {err && <div className={s.err}>{err}</div>}
        <form className={s.form} onSubmit={submit}>
          <div className={s.field}><label>Username</label>
            <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="your_username" required /></div>
          <div className={s.field}><label>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required /></div>
          <button className={s.btn} disabled={busy}>{busy?'Signing in…':'Sign in →'}</button>
        </form>
        <p className={s.switch}>No account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}
