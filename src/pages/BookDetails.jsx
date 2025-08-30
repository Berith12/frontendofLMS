import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navrbar';
import Footer from '../components/footer';
import { getBook, borrowBook as borrowAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { books as localBooks } from '../data/books';

export default function BookDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setMsg('');
      const isHexId = /^[a-f\d]{24}$/i.test(id || '');
      if (isHexId) {
        try {
          const { book } = await getBook(id);
          if (!cancelled) setBook(book);
          return;
        } catch (e) {
          // fall through to title lookup
        }
      }

      // Fallback: treat param as title slug and search local dataset
      const title = decodeURIComponent(id || '').toLowerCase();
      const local = localBooks.find(b => (b.title || '').toLowerCase() === title);
      if (local) {
        if (!cancelled) setBook({ ...local });
      } else {
        if (!cancelled) setMsg('Book not found');
      }
    };
    run();
    return () => { cancelled = true; };
  }, [id]);

  const borrow = async () => {
    setMsg('');
    try {
      if (!book?._id) {
        setMsg('This item cannot be borrowed here.');
        return;
      }
      await borrowAPI(token, book._id);
      setMsg('Borrowed');
      setBook({ ...book, available: (book.available || 0) - 1 });
    } catch (e) { setMsg(e.message || 'Borrow failed'); }
  };

  if (!book) return null;
  const disabled = (book.available ?? 0) <= 0 || !book._id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl text-white font-bold">{book.title}</h1>
        <div className="text-gray-300 mt-2">Author: {book.author}</div>
  <div className="text-gray-300">ISBN: {book.isbn || 'N/A'}</div>
        <div className="text-gray-300">Available: {book.available ?? 0}</div>
        {msg && <div className="text-sm text-gray-300 mt-3">{msg}</div>}
        <button disabled={disabled} onClick={borrow} className={`mt-5 px-5 py-2 rounded text-white ${disabled ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'}`}>
          Borrow
        </button>
      </main>
      <Footer />
    </div>
  );
}
