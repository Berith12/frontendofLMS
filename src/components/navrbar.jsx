import { useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { books } from "../data/books";

function Navbar({ logoutOnly = false }) {
  const { user, logout } = useAuth();
  const genres = [
    'Action','Action & Adventure','Adventure','Animation','Biography','Comedy','Costume','Crime',
    'Documentary','Drama','Family','Fantasy','Film-Noir','Game-Show','History','Horror','Kungfu'
  ];
  const [genreOpen, setGenreOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matched = books.filter((b) =>
      b.title.toLowerCase().includes(q) ||
      (b.author || "").toLowerCase().includes(q) ||
      (b.genres || []).some((g) => g.toLowerCase().includes(q))
    );
    return matched.slice(0, 8);
  }, [query]);

  const highlight = (text) => {
    const q = query.trim();
    if (!q) return text;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = String(text).split(new RegExp(`(${esc})`, "ig"));
    return parts.map((p, i) =>
      p.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-yellow-500/60 text-black rounded px-0.5">{p}</mark>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  // Instantly open/close dropdown, no delay
  const handleLeave = (e) => {
    if (!btnRef.current?.contains(e.relatedTarget) && !menuRef.current?.contains(e.relatedTarget)) {
      setGenreOpen(false);
    }
  };

  // Minimal bar: only a Logout button
  if (logoutOnly) {
    return (
      <nav className="w-full bg-gradient-to-b from-black via-gray-900 to-transparent px-8 py-4 flex items-center justify-end">
        {user && (
          <button onClick={logout} className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-500">
            Logout
          </button>
        )}
      </nav>
    );
  }

  return (
    <nav className="w-full bg-gradient-to-b from-black via-gray-900 to-transparent px-8 py-4 flex items-center justify-between">
      {/* Logo */}
  <a href="/home" aria-label="Go to Home" className="flex items-center gap-2 group">
        <span className="text-3xl font-bold italic text-white group-hover:text-blue-300 transition-colors">Library Management System</span>
      </a>
      {/* Center Nav */}
  <ul className="flex gap-10 items-center">
        <li><a href="/home" className="text-gray-200 font-semibold hover:text-white">Home</a></li>
        <li><a href="/books" className="text-gray-200 font-semibold hover:text-white">Books</a></li>
        <li className="relative">
          <button
            ref={btnRef}
            onMouseEnter={() => setGenreOpen(true)}
            onMouseLeave={handleLeave}
            onClick={() => setGenreOpen((v) => !v)}
            className="text-gray-200 font-semibold hover:text-white flex items-center focus:outline-none"
            aria-haspopup="true"
            aria-expanded={genreOpen}
            type="button"
            style={{ zIndex: 51 }}
          >
            Genre
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
          </button>
      {genreOpen && (
            <div
              ref={menuRef}
              onMouseEnter={() => setGenreOpen(true)}
              onMouseLeave={handleLeave}
        className="absolute left-0 top-full bg-gray-900/95 rounded-xl border border-gray-700 shadow-2xl p-5 w-[760px] max-w-[95vw] mt-0 max-h-[75vh] overflow-y-auto"
        style={{ minWidth: 520, zIndex: 60 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-3">
                <a href="/books" className="block text-gray-200 hover:text-white leading-6">All</a>
                {genres.map((g) => (
                  <a
                    key={g}
                    href={`/books?genre=${encodeURIComponent(g)}`}
                    className="block text-gray-300 hover:text-white whitespace-normal break-words leading-6"
                  >
                    {g}
                  </a>
                ))}
              </div>
            </div>
          )}
        </li>
        <li><a href="/contact" className="text-gray-200 font-semibold hover:text-white">Contact</a></li>
        {user?.role === 'Librarian' && (
          <li><a href="/admin" className="text-gray-200 font-semibold hover:text-white">Manage Books</a></li>
        )}
        {/* Search (desktop) */}
        <li className="hidden md:block relative z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const term = query.trim();
              window.location.href = term ? `/books?search=${encodeURIComponent(term)}` : "/books";
            }}
            role="search"
            aria-label="Search books"
          >
            <div className="relative">
              {/* Clickable search icon that focuses the input and opens suggestions */}
              <button
                type="button"
                aria-label="Focus search"
                onMouseDown={(e) => {
                  e.preventDefault();
                  searchInputRef.current?.focus();
                  setSearchOpen(true);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-70 hover:opacity-100 cursor-pointer"
                style={{ background: "transparent" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                type="search"
                placeholder="Search books..."
                className="bg-gray-800/60 border border-gray-700 rounded-md pl-9 pr-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 md:w-72"
              />

              {/* Suggestions dropdown */}
        {searchOpen && query.trim() && suggestions.length > 0 && (
                <div
          className="absolute left-0 mt-2 w-56 md:w-72 bg-gray-900/95 border border-gray-700 rounded-lg shadow-xl py-1 max-h-[60vh] overflow-y-auto z-40"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setSearchOpen(true)}
                >
                  {suggestions.map((b) => {
                    const target = b._id ? `/books/${b._id}` : `/books/${encodeURIComponent(b.title)}`;
                    return (
                      <div
                        key={b.title}
                        className="px-3 py-2 hover:bg-gray-800 cursor-pointer text-sm text-gray-200"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          window.location.href = target;
                        }}
                      >
                        <div className="font-medium">{highlight(b.title)}</div>
                        {(b.author || b.genres?.length) && (
                          <div className="text-xs text-gray-400">
                            {[b.author, (b.genres || []).slice(0, 2).join(", ")].filter(Boolean).join(" · ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </form>
        </li>
      </ul>
      {/* Auth Links */}
      <div className="flex gap-3 items-center">
        {user ? (
          <button onClick={logout} className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-500">
            Logout
          </button>
        ) : (
          <>
            <a href="/login" className="px-4 py-2 rounded border border-gray-600 text-gray-200 hover:bg-gray-800">Login</a>
            <a href="/register" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;