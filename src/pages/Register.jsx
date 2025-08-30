import { useState } from 'react';
import { register } from '../services/api';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setOk('');
    // basic validation
    if (!name.trim()) return setError('Please enter your name');
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) return setError('Please enter a valid email');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register(name, email, password, 'Borrower');
      setOk('Registered. You can now log in.');
      toast.success('Registration successful!');
    } catch (e) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      {/* Top nav with centered logo */}
      <header className="w-full border-b border-gray-800/70 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <a href="/featured" aria-label="Go to Featured" className="text-2xl md:text-3xl font-bold italic text-white hover:text-blue-300 transition-colors">
            Library Management System
          </a>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <form onSubmit={onSubmit} className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-xl text-white font-semibold mb-1">Create your account</h1>
        <p className="text-gray-400 text-sm mb-4">Join the library to read and borrow books.</p>
        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
        {ok && <div className="text-green-400 text-sm mb-3">{ok}</div>}
        <label className="block text-gray-300 text-sm">Name</label>
        <input className="w-full mt-1 mb-3 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Doe" />
        <label className="block text-gray-300 text-sm">Email</label>
        <input className="w-full mt-1 mb-3 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label className="block text-gray-300 text-sm">Password</label>
        <div className="relative">
          <input type={showPw ? 'text' : 'password'} className="w-full mt-1 mb-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 6 characters" />
          <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-2 top-2 text-xs text-gray-300 hover:text-white">{showPw ? 'Hide' : 'Show'}</button>
        </div>
  <label className="block text-gray-300 text-sm">Confirm Password</label>
        <input type={showPw ? 'text' : 'password'} className="w-full mt-1 mb-3 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Repeat password" />
  {/* Role selection removed; server will assign default role */}
  <div className="mb-4" />
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-2 rounded">{loading ? 'Creating…' : 'Create Account'}</button>
        <div className="text-sm text-gray-400 mt-3">Already have an account? <a className="text-blue-400 hover:text-blue-300" href="/login">Sign in</a></div>
        </form>
      </div>
    </div>
  );
}
