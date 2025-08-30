import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { listBooks } from '../services/api';
import { books as staticBooks } from '../data/books';

function StatCard({ label, value, icon }){
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow p-5">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-3xl font-bold">{value}</div>
        <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-lg">{icon}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard(){
  const [stats, setStats] = useState({ totalTitles: 0, totalCopies: 0, available: 0, onLoan: 0 });

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await listBooks();
        const items = data.books || [];
        // Total copies from DB only
        const qty = items.reduce((a,b)=>a+(Number(b.quantity)||0),0);
        const available = items.reduce((a,b)=>a+(Number(b.available)||0),0);
        const onLoan = Math.max(0, qty - available);
        // Combine titles from DB and public Books page (dedupe by title)
        const setTitles = new Set(
          items.map(b => (b.title || '').trim().toLowerCase()).filter(Boolean)
        );
        staticBooks.forEach(s => {
          const t = (s.title || '').trim().toLowerCase();
          if (t) setTitles.add(t);
        });
        const totalTitles = setTitles.size;
        setStats({ totalTitles, totalCopies: qty, available, onLoan });
      }catch(e){
      }
    })();
  },[]);

  return (
    <AdminLayout logoutOnlyNav>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        <StatCard label="Total Books" value={stats.totalTitles} icon="�" />
        <StatCard label="Available" value={stats.available} icon="📗" />
        <StatCard label="Borrowed" value={stats.onLoan} icon="📕" />
      </div>
    </AdminLayout>
  );
}
