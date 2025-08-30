import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMe, updateMe } from '../services/api';
import Navbar from '../components/navrbar';
import Footer from '../components/footer';

export default function Profile() {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    getMe(token).then(({ user }) => { setName(user?.name || ''); setEmail(user?.email || ''); });
  }, [token]);

  const onSave = async (e) => {
    e.preventDefault(); setMsg('');
    try { await updateMe(token, { name, email }); setMsg('Saved'); } catch (e) { setMsg(e.message); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 max-w-xl mx-auto w-full">
        <h1 className="text-2xl text-white font-semibold mb-4">Profile</h1>
        {msg && <div className="text-sm text-gray-300 mb-3">{msg}</div>}
        <form onSubmit={onSave} className="bg-gray-900 p-5 rounded-xl border border-gray-700">
          <label className="block text-gray-300 text-sm">Name</label>
          <input className="w-full mt-1 mb-3 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700" value={name} onChange={(e)=>setName(e.target.value)} />
          <label className="block text-gray-300 text-sm">Email</label>
          <input className="w-full mt-1 mb-4 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded">Save</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
