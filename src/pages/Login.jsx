import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const contextLogin = auth ? auth.login : null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) return setError('Please enter a valid email');
    if (!password) return setError('Please enter your password');
    setLoading(true);
    
    try {
      // Use centralized axios client (baseURL http://localhost:5001/api)
      const data = await apiLogin(email, password);
      // Debug-style logs like the screenshot
      console.log('Email:', email, 'Password:', password);
      console.log('Token:', data.token);
      console.log('User:', data.data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored:', data.token);
      }
  if (contextLogin) {
        contextLogin({ ...data.data, token: data.token });
      }
  toast.success('Login successful!');
  navigate('/home');
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      {/* Top nav with centered logo */}
      <header className="w-full border-b border-gray-800/70 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <a href="/home" aria-label="Go to Home" className="text-2xl md:text-3xl font-bold italic text-white hover:text-blue-300 transition-colors">
            Library Management System
          </a>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <form onSubmit={onSubmit} className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
          <h1 className="text-xl text-white font-semibold mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-4">Sign in to manage your library account.</p>
          {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
          <label className="block text-gray-300 text-sm">Email</label>
          <input
            className="w-full mt-1 mb-3 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <label className="block text-gray-300 text-sm">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className="w-full mt-1 mb-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-2 top-2 text-xs text-gray-300 hover:text-white">
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" /> Remember me
            </label>
            <a href="#" className="hover:text-gray-200">Forgot password?</a>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-2 rounded">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <div className="text-sm text-gray-400 mt-3">
            New here? <a href="/register" className="text-blue-400 hover:text-blue-300">Create an account</a>
          </div>
        </form>
      </div>
    </div>
  );
}
