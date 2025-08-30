import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/navrbar";
import Footer from "../components/footer";
import { books as staticBooks } from "../data/books";
import { listBooks } from "../services/api";

function Books() {
  const location = useLocation();
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("search") || "");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");
  const [stats, setStats] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allTypes = useMemo(
    () => Array.from(new Set((allBooks || []).map((b) => b.type))).filter(Boolean),
    [allBooks]
  );
  const allStatuses = ["Completed", "Ongoing", "N/A"];

  // Keep local search in sync with URL when it changes (from navbar search)
  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search).get("search") || "";
    setSearch(urlSearch);
  }, [location.search]);

  // Load books from backend (with static fallback) and compute stats
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listBooks();
        const items = data.books || [];
        const source = items.length ? items : staticBooks;
        setAllBooks(source);
        const totalTitles = source.length;
        const totalCopies = source.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
        const available = source.reduce((a, b) => a + (Number(b.available) || 0), 0);
        const borrowed = Math.max(0, totalCopies - available);
        setStats({ totalTitles, totalCopies, available, borrowed });
      } catch (e) {
        setAllBooks(staticBooks);
        setStats({ totalTitles: staticBooks.length });
        setError(e.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = allBooks;

    // search by title, author, genres
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q) ||
          (b.genres || []).some((g) => g.toLowerCase().includes(q))
      );
    }

    if (status !== "all") {
      list = list.filter(
        (b) => (b.status || "").toLowerCase() === status.toLowerCase()
      );
    }

    if (type !== "all") {
      list = list.filter((b) => b.type === type);
    }

    // sorting
    list = [...list];
    switch (sortBy) {
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "rating-asc":
        list.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
        break;
      default:
        break;
    }
    return list;
  }, [allBooks, search, status, type, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Books</h1>
            <p className="text-gray-400">
              Showing {filtered.length} of {allBooks.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search title, author, genre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
            >
              <option value="all">All Status</option>
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
            >
              <option value="all">All Types</option>
              {allTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
            >
              <option value="title-asc">Title A→Z</option>
              <option value="title-desc">Title Z→A</option>
              <option value="rating-desc">Rating High→Low</option>
              <option value="rating-asc">Rating Low→High</option>
            </select>
          </div>
        </header>

        {/* Grid */}
        {loading && (
          <div className="mt-8 text-gray-400">Loading books…</div>
        )}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((b, i) => {
            const to = b._id ? `/books/${b._id}` : `/books/${encodeURIComponent(b.title)}`;
            return (
              <Link key={b.title + i} to={to} className="group">
                <article className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow group-hover:border-gray-500 transition-colors">
                  <div className="relative h-56 bg-gray-800">
                    <img src={b.cover} alt={b.title} className="w-full h-full object-cover object-top" loading="lazy" />
                    {typeof b.rating === "number" && (
                      <span className="absolute top-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">{b.rating}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">{b.title}</h3>
                    <div className="text-xs text-gray-400 mt-1">{b.type}</div>
                    <div className="text-xs text-gray-400 mt-1">Status: {b.status}</div>
                    {b.genres?.length ? (
                      <div className="text-xs text-gray-500 mt-1 truncate">{b.genres.join(", ")}</div>
                    ) : null}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Books;