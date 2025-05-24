"use client";

import { useState } from "react";
import { Book, SearchResult } from "@/types/book";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "title" | "author">(
    "all"
  );
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, searchType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Search failed");
      }

      setSearchResult(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Library Search Assistant
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as "all" | "title" | "author")
              }
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {searchResult && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">
                {searchResult.book.title}
              </h2>
              <p className="text-gray-600 mb-2">
                by {searchResult.book.author}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-semibold">Call Number:</span>{" "}
                  {searchResult.book.callNumber}
                </div>
                <div>
                  <span className="font-semibold">Location:</span>{" "}
                  {searchResult.book.shelfLocation}
                </div>
                <div>
                  <span className="font-semibold">Published:</span>{" "}
                  {searchResult.aiPublishedYear}
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                {searchResult.aiGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Summary:</h3>
                  <p className="text-gray-700">{searchResult.aiSummary}</p>
                </div>
              </div>
            </div>

            {searchResult.relatedBooks.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Related Books</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResult.relatedBooks.map((book: Book) => (
                    <div
                      key={book.id}
                      className="bg-white p-4 rounded-lg shadow border border-gray-200"
                    >
                      <h4 className="font-semibold">{book.title}</h4>
                      <p className="text-gray-600">by {book.author}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Location: {book.shelfLocation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
