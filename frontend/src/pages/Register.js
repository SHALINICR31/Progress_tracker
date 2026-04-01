import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import s from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'' });
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.username, data.user_id); nav('/');
    } catch(ex) { setErr(ex.response?.data?.error || 'Registration failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.logo}><div className={s.logoMark}>✦</div><h1>TaskFlow</h1></div>
        <p className={s.sub}>Create your account and start tracking.</p>
        {err && <div className={s.err}>{err}</div>}
        <form className={s.form} onSubmit={submit}>
          <div className={s.field}><label>Username</label>
            <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="your_username" required /></div>
          <div className={s.field}><label>Email</label>
            <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com" required /></div>
          <div className={s.field}><label>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 characters" required minLength={6} /></div>
          <button className={s.btn} disabled={busy}>{busy?'Creating…':'Get started →'}</button>
        </form>
        <p className={s.switch}>Have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
