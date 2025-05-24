import { NextResponse } from "next/server";
import { books } from "@/data/books";
import { getBookInformation } from "@/utils/gemini";
import { Book, SearchRequest } from "@/types/book";

export async function POST(request: Request) {
  try {
    const body: SearchRequest = await request.json();
    const { query, searchType = "all" } = body;

    // Search for books based on the query
    const searchResults = books.filter((book) => {
      if (searchType === "title") {
        return book.title.toLowerCase().includes(query.toLowerCase());
      } else if (searchType === "author") {
        return book.author.toLowerCase().includes(query.toLowerCase());
      } else {
        return (
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.callNumber.toLowerCase().includes(query.toLowerCase()) ||
          book.shelfLocation.toLowerCase().includes(query.toLowerCase())
        );
      }
    });

    if (!searchResults.length) {
      return NextResponse.json({
        message: "No books found matching your search criteria",
        results: null,
      });
    }

    // Get the first matching book
    const mainBook = searchResults[0];

    // Get all book information including related books
    const availableBooks = books
      .filter((book) => book.id !== mainBook.id)
      .map((book) => book.title);

    const bookInfo = await getBookInformation(
      mainBook.title,
      mainBook.author,
      availableBooks
    );

    const relatedBooks = books.filter(
      (book) =>
        bookInfo.relatedBooks.includes(book.title) && book.id !== mainBook.id
    );

    return NextResponse.json({
      message: "Success",
      results: {
        book: mainBook,
        aiSummary: bookInfo.summary,
        aiPublishedYear: bookInfo.publishedYear,
        aiGenres: bookInfo.genres,
        relatedBooks,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
