export interface Book {
  id: string;
  title: string;
  author: string;
  callNumber: string;
  shelfLocation: string;
}

export interface SearchResult {
  book: Book;
  aiSummary: string;
  aiPublishedYear: string;
  aiGenres: string[];
  relatedBooks: Book[];
}

export interface SearchRequest {
  query: string;
  searchType?: "title" | "author" | "all";
}
