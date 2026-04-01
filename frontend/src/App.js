import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login        from './pages/Login';
import Register     from './pages/Register';
import TasksPage    from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import Layout       from './components/Layout';

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div style={{width:32,height:32,borderRadius:'50%',border:'3px solid var(--border)',borderTopColor:'var(--accent)',animation:'spin .7s linear infinite'}} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}
function Public({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Public><Login /></Public>} />
          <Route path="/register" element={<Public><Register /></Public>} />
          <Route path="/" element={<Guard><Layout /></Guard>}>
            <Route index        element={<TasksPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
