import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navrbar";
import Footer from "../components/footer";
import { FaStar, FaTrophy } from "react-icons/fa";
import { books } from "../data/books";

function BookSlider() {
  // New Books = anything not completed, all from central dataset
  const newBooks = books.filter(
    (b) => (b.status || "").toLowerCase() !== "completed"
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const len = newBooks.length;

  useEffect(() => {
    if (paused || !len) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, 2000);
    return () => clearInterval(timerRef.current);
  }, [paused, len]);

  if (!len) return null;

  return (
    <section
      className="w-full flex justify-center mt-8 px-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full max-w-5xl">
        {newBooks.map((b, i) => {
          const active = i === index;
          return (
            <article
              key={b.title + i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="rounded-xl border border-gray-700/60 bg-gradient-to-br from-gray-800/70 via-gray-900/70 to-gray-900/90 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] p-6 md:p-8 backdrop-blur">
                <div className="flex gap-6 md:gap-10 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-400/90 text-black font-bold rounded-lg shadow">
                        {b.rating ?? "-"}
                      </div>
                      {(() => {
                        const to = b._id ? `/books/${b._id}` : `/books/${encodeURIComponent(b.title)}`;
                        return (
                          <h2 className="text-2xl md:text-3xl font-semibold text-white truncate">
                            <Link to={to} className="hover:underline">
                              {b.title}
                            </Link>
                          </h2>
                        );
                      })()}
                    </div>
                    {b.type && (
                      <div className="mt-2 text-yellow-400 text-sm font-semibold tracking-wide">
                        {b.type}
                      </div>
                    )}
                    {b.genres?.length ? (
                      <div className="mt-3 text-gray-300">{b.genres.join(", ")}</div>
                    ) : null}
                    {b.summary && (
                      <div className="mt-5">
                        <h3 className="text-sm text-gray-200 font-bold mb-1">SUMMARY</h3>
                        <p className="text-gray-300 max-h-20 overflow-hidden">{b.summary}</p>
                      </div>
                    )}
                    <div className="mt-4 text-gray-200">
                      <div>Status: <span className="text-gray-300">{b.status ?? "N/A"}</span></div>
                      {b.author && (
                        <div>Author: <span className="text-gray-300">{b.author}</span></div>
                      )}
                    </div>
                  </div>
                  {b.cover && (() => {
                    const to = b._id ? `/books/${b._id}` : `/books/${encodeURIComponent(b.title)}`;
                    return (
                      <Link to={to} className="shrink-0">
                        <img
                          src={b.cover}
                          alt={b.title}
                          className="w-36 h-52 md:w-44 md:h-64 object-cover object-top rounded-md shadow-md border border-gray-700 cursor-pointer"
                        />
                      </Link>
                    );
                  })()}
                </div>
              </div>
            </article>
          );
        })}

        {/* reserve height */}
        <div className="invisible">
          <div className="rounded-xl p-8">
            <div className="flex gap-10">
              <div className="flex-1">
                <div className="h-6" />
                <div className="h-5" />
                <div className="h-20" />
              </div>
              <div className="w-44 h-64" />
            </div>
          </div>
        </div>

        {/* dots */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-2">
          {newBooks.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === index ? "bg-yellow-400 w-4" : "bg-gray-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Recommends derived ONLY from central books dataset.
// If you add b.recommended = true in data/books.js it will use that;
// otherwise it falls back to top 12 by rating (desc), then title.
function RecommendGrid() {
  const recommends = useMemo(() => {
    const src = books.slice();

    const flagged = src.filter((b) => b.recommended === true);
    const base = (flagged.length ? flagged : src)
      .filter((b) => b.title) // keep valid entries
      .sort((a, b) => {
        const ra = typeof a.rating === "number" ? a.rating : -1;
        const rb = typeof b.rating === "number" ? b.rating : -1;
        if (rb !== ra) return rb - ra; // higher rating first
        return a.title.localeCompare(b.title);
      })
      .slice(0, 12);

    return base.map((b, i) => ({ ...b, rank: i + 1 }));
  }, []);

  if (!recommends.length) return null;

  return (
    <section className="px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Recommends</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {recommends.map((r) => {
            const score =
              typeof r.rating === "number" ? (r.rating / 2).toFixed(1) : "—";
            const to = r._id ? `/books/${r._id}` : `/books/${encodeURIComponent(r.title)}`;
            return (
              <Link
                to={to}
                key={r.title}
                className="group overflow-hidden rounded-2xl border border-gray-700/70 bg-gray-900/40 hover:border-gray-500 transition-colors shadow"
              >
                <div className="relative h-56 bg-gray-800">
                  {r.cover ? (
                    <img
                      src={r.cover}
                      alt={r.title}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
                    <FaStar className="text-yellow-400" />
                    <span>{score}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-gray-100 font-semibold text-sm leading-snug h-10 overflow-hidden hover:underline">
                    {r.title}
                  </h3>
                  <div className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                    <FaTrophy className="text-gray-500" />
                    <span>RANK {r.rank}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Featured() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      <Navbar />
      <header className="px-4 mt-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">New Books</h1>
        <p className="text-gray-300 mt-2">A rotating spotlight of newly added/ongoing titles.</p>
      </header>
      <BookSlider />
      <RecommendGrid />
      <div className="px-4 mt-10 mb-16 text-center">
        <a
          href="/books"
          className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
        >
          Open Full Library
        </a>
      </div>
      <Footer />
    </div>
  );
}