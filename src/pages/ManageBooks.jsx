import { useEffect, useMemo, useState } from 'react';
import { listBooks, createBook, updateBook, deleteBook, deleteAllBooks, listBorrowRecords } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';
import { books as staticBooks } from '../data/books';

export default function ManageBooks() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [needReturnCount, setNeedReturnCount] = useState(0);
  const [form, setForm] = useState({ title:'', author:'', isbn:'', quantity:1, available:1, cover:'', genres:'', type:'', status:'', rating:'', summary:'', recommended:false });
  const [editing, setEditing] = useState(null);

  const canManage = user && (user.role === 'Admin' || user.role === 'Librarian');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listBooks();
        setItems(data.books || []);
        // Also compute how many borrowed items still need to be returned
        try {
          const rec = await listBorrowRecords();
          const list = rec.borrowRecords || [];
          const outstanding = list.filter(r => String(r?.book?.returnDate || '').toLowerCase() !== 'returned').length;
          setNeedReturnCount(outstanding);
        } catch {
          setNeedReturnCount(0);
        }
      } catch (e) {
        toast.error(e.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetForm = () => setForm({ title:'', author:'', isbn:'', quantity:1, available:1, cover:'', genres:'', type:'', status:'', rating:'', summary:'', recommended:false });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        available: Number(form.available),
        genres: typeof form.genres === 'string' ? form.genres.split(',').map(s=>s.trim()).filter(Boolean) : form.genres,
        rating: form.rating ? Number(form.rating) : undefined,
      };
      if (editing) {
        const res = await updateBook(editing._id, payload);
        setItems((arr) => arr.map(b => b._id === editing._id ? res.book : b));
        toast.success('Book updated');
        setEditing(null);
      } else {
        const res = await createBook(payload);
        setItems((arr) => [res.book, ...arr]);
        toast.success('Book created');
      }
      resetForm();
    } catch (e) {
      toast.error(e.message || 'Save failed');
    }
  };

  const onEdit = (b) => {
    setEditing(b);
    setForm({
      title: b.title || '',
      author: b.author || '',
      isbn: b.isbn || '',
      quantity: b.quantity ?? 1,
      available: b.available ?? 1,
      cover: b.cover || '',
      genres: (b.genres || []).join(', '),
      type: b.type || '',
      status: b.status || '',
      rating: b.rating ?? '',
      summary: b.summary || '',
      recommended: !!b.recommended,
    });
  };

  const onDelete = async (b) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await deleteBook(b._id);
      setItems((arr) => arr.filter(x => x._id !== b._id));
      toast.success('Book deleted');
    } catch (e) {
      toast.error(e.message || 'Delete failed');
    }
  };

  // Unique title count combining DB items and Books page static titles
  const totalTitlesCombined = useMemo(() => {
    const set = new Set(
      items.map(b => (b.title || '').trim().toLowerCase()).filter(Boolean)
    );
    (staticBooks || []).forEach(s => {
      const t = (s.title || '').trim().toLowerCase();
      if (t) set.add(t);
    });
    return set.size;
  }, [items]);

  // Track which titles already exist in DB (to avoid duplicate rows for static ones)
  const dbTitleSet = useMemo(() => {
    return new Set(
      items.map(b => (b.title || '').trim().toLowerCase()).filter(Boolean)
    );
  }, [items]);

  if (!canManage) {
    return <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-200 p-6">Access denied</div>;
  }

  return (
    <AdminLayout logoutOnlyNav>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>
    <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500"
          onClick={async ()=>{
      if(!window.confirm('Remove ALL books? This cannot be undone.')) return;
            try {
              await deleteAllBooks();
              setItems([]);
              toast.success('All books removed');
            } catch(e){
              toast.error(e.message || 'Bulk delete failed');
            }
          }}
        >Remove All</button>
      </div>
  {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white text-black rounded-xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Total Books</div>
          <div className="text-2xl font-bold">{totalTitlesCombined}</div>
        </div>
        <div className="bg-white text-black rounded-xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Available</div>
          <div className="text-2xl font-bold">{items.reduce((a,b)=>a+(Number(b.available)||0),0)}</div>
        </div>
        <div className="bg-white text-black rounded-xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Borrowed</div>
          <div className="text-2xl font-bold">{items.reduce((a,b)=>a+(Number(b.quantity||0)-Number(b.available||0)),0)}</div>
        </div>
        <div className="bg-white text-black rounded-xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Need to be returned</div>
          <div className="text-2xl font-bold">{needReturnCount}</div>
        </div>
      </div>

  {/* Form card */}
  <div className="bg-white text-black rounded-xl shadow p-4 mb-8">
        <h2 className="font-semibold mb-3">{editing ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="ISBN" value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} required />
          <input type="number" className="border rounded px-3 py-2" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required />
          <input type="number" className="border rounded px-3 py-2" placeholder="Available" value={form.available} onChange={e=>setForm({...form,available:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="Cover URL" value={form.cover} onChange={e=>setForm({...form,cover:e.target.value})} />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Genres (comma separated)" value={form.genres} onChange={e=>setForm({...form,genres:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Status" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} />
          <input type="number" step="0.1" className="border rounded px-3 py-2" placeholder="Rating" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} />
          <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Summary" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.recommended} onChange={e=>setForm({...form,recommended:e.target.checked})} /> Recommended</label>
          <div className="md:col-span-3 flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="border px-4 py-2 rounded" onClick={()=>{setEditing(null); resetForm();}}>Cancel</button>}
          </div>
        </form>
      </div>

  {/* Table card */}
  <div className="bg-white text-black rounded-xl shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 uppercase text-xs">
                <th className="p-2">Title</th>
                <th className="p-2">Author</th>
                <th className="p-2">ISBN</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Avail</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-2 font-medium">{b.title}</td>
                  <td className="p-2">{b.author}</td>
                  <td className="p-2">{b.isbn}</td>
                  <td className="p-2">{b.quantity}</td>
                  <td className="p-2">{b.available}</td>
                  <td className="p-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={()=>onEdit(b)}
                      aria-label="Edit book"
                      title="Edit"
                      className="p-2 rounded hover:bg-gray-100 text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.714 0l-1.157 1.157 3.714 3.714 1.157-1.157a2.625 2.625 0 000-3.714z" />
                        <path d="M3 17.25V21h3.75L19.605 8.145l-3.714-3.714L3 17.25z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={()=>onDelete(b)}
                      aria-label="Delete book"
                      title="Delete"
                      className="p-2 rounded hover:bg-red-50 text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M9 3a1 1 0 00-1 1v1H4.5a.75.75 0 000 1.5h.69l.87 12.18A2.75 2.75 0 008.803 22h6.394a2.75 2.75 0 002.743-2.32L18.81 6.5h.69a.75.75 0 000-1.5H16V4a1 1 0 00-1-1H9zm6 3.5l-.84 11.73a1.25 1.25 0 01-1.247 1.12H11.09a1.25 1.25 0 01-1.247-1.12L9 6.5h6zM10.5 4h3v1h-3V4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {/* Append static Books page titles as read-only rows (skip if title already exists in DB) */}
              {(staticBooks || []).filter(s => {
                const t = (s.title || '').trim().toLowerCase();
                return t && !dbTitleSet.has(t);
              }).map((s, i) => (
                <tr key={`static-${s.title}-${i}`} className="border-t opacity-90">
                  <td className="p-2 font-medium">{s.title}</td>
                  <td className="p-2">{s.author || '-'}</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2 flex items-center gap-2">
                    <span className="p-2 rounded text-gray-400 cursor-not-allowed" title="Not editable" aria-hidden>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.714 0l-1.157 1.157 3.714 3.714 1.157-1.157a2.625 2.625 0 000-3.714z" />
                        <path d="M3 17.25V21h3.75L19.605 8.145l-3.714-3.714L3 17.25z" />
                      </svg>
                    </span>
                    <span className="p-2 rounded text-gray-400 cursor-not-allowed" title="Not deletable" aria-hidden>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M9 3a1 1 0 00-1 1v1H4.5a.75.75 0 000 1.5h.69l.87 12.18A2.75 2.75 0 008.803 22h6.394a2.75 2.75 0 002.743-2.32L18.81 6.5h.69a.75.75 0 000-1.5H16V4a1 1 0 00-1-1H9zm6 3.5l-.84 11.73a1.25 1.25 0 01-1.247 1.12H11.09a1.25 1.25 0 01-1.247-1.12L9 6.5h6zM10.5 4h3v1h-3V4z" />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (staticBooks?.length ?? 0) === 0 && !loading && (
                <tr><td className="p-3 text-center text-gray-500" colSpan={6}>No books</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  </AdminLayout>
  );
}
