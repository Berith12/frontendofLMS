import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/navrbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { books } from "../data/books";

function LandingGate() {
  const navigate = useNavigate();
  const [flash, setFlash] = useState(null);
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem('flash');
      if (msg) {
        setFlash(msg);
        sessionStorage.removeItem('flash');
        const t = setTimeout(() => setFlash(null), 2000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);
  const stats = useMemo(() => {
    const total = books.length;
    const newBooks = books.filter(
      b => (b.status || "").toLowerCase() !== "completed"
    ).length;
    return { total, newBooks };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      {flash && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border text-sm shadow bg-emerald-900/30 border-emerald-400/60 text-emerald-200">
          {flash}
        </div>
      )}
      <Navbar />

      
      <section className="px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Explore our Library Management System
          </h1>
          <p className="text-gray-300 mt-4">
            There are various books you can explore in our library management
            system. Browse, search, and track your favorites with ease.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/home', { replace: true })}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
              type="button"
            >
              Browse Library
            </button>
            <a
              href="#features"
              className="px-6 py-3 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      
      <section className="px-4 mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 text-center shadow">
            <div className="text-4xl font-bold text-white">
              {stats.newBooks}
            </div>
            <div className="text-gray-400 mt-1">New Books</div>
          </div>
          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 text-center shadow">
            <div className="text-4xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400 mt-1">Total Books</div>
          </div>
        </div>
      </section>

  
      <section id="features" className="px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
            Everything you need to read your books.
          </h2>
          <p className="text-gray-400 text-center mt-2">
            Well, everything you need if you aren’t that picky about minor
            details.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow">
              <h3 className="text-white font-semibold text-lg">
                Mark your favorite books
              </h3>
              <p className="text-gray-300 mt-2">
                Save and quickly access your favorite titles or series.
              </p>
            </div>
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow">
              <h3 className="text-white font-semibold text-lg">Filter & genres</h3>
              <p className="text-gray-300 mt-2">
                Find titles by genre, status, author, and more.
              </p>
            </div>
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow">
              <h3 className="text-white font-semibold text-lg">Advanced search</h3>
              <p className="text-gray-300 mt-2">
                Search by title, tags, or metadata quickly.
              </p>
            </div>
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow">
              <h3 className="text-white font-semibold text-lg">Reading progress</h3>
              <p className="text-gray-300 mt-2">Pick up right where you stopped.</p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="px-4 mt-20 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Join our community on Discord and Reddit
          </h2>
          <p className="text-gray-300 mt-2">
            Ask questions, share suggestions, and find the best books to read.
          </p>

          <div className="mt-4 flex items-center justify-center gap-6 text-blue-300">
            <a href="#" className="hover:text-blue-200">
              Discord
            </a>
            <span className="text-gray-500">•</span>
            <a href="#" className="hover:text-blue-200">
              Reddit
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingGate;