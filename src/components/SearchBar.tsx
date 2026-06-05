"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { createPortal } from "react-dom";


export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  return (
    <div className="search__wrapper">
      <div className="search__input--wrapper">
        <input
          type="text"
          placeholder="Search for books"
          className="search__input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AiOutlineSearch className="search__icon" />
      </div>
      {search.trim() && typeof window !== "undefined" && createPortal(
        <div className="search__results">
          {loading && <p className="search__loading">Searching...</p>}
          {!loading && results.length === 0 && (
            <p className="search__no-results">No results found</p>
          )}
          {!loading && results.map((book) => (
            <div
              key={book.id}
              className="search__result--item"
              onClick={() => {
                router.push(`/book/${book.id}`);
                setSearch("");
                setResults([]);
              }}
            >
              <img src={book.imageLink} alt={book.title} className="search__result--img" />
              <div>
                <p className="search__result--title">{book.title}</p>
                <p className="search__result--author">{book.author}</p>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}