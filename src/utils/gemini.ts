import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function getBookInformation(
  bookTitle: string,
  author: string,
  availableBooks: string[]
): Promise<{
  summary: string;
  publishedYear: string;
  genres: string[];
  relatedBooks: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Analyze the book "${bookTitle}" by ${author} and provide information in JSON format. Return ONLY a JSON object with no additional text or formatting. The JSON should have these exact keys:
- summary: a 2-4 sentence summary of content and themes
- publishedYear: the publication year as a string
- genres: array of 2-3 genre strings
- relatedBooks: array of 3 related book titles from this list: ${availableBooks.join(
      ", "
    )}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Remove any markdown formatting if present
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating book information:", error);
    return {
      summary: "Summary unavailable",
      publishedYear: "Unknown",
      genres: ["Unknown"],
      relatedBooks: [],
    };
  }
}
