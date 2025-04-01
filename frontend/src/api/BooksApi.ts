import { book } from '../types/book';

interface FetchBooksResponse {
  books: book[];
  totalNumBooks: number;
}

export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `bookCategory=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${
        selectedCategories.length ? `&${categoryParams}` : ''
      }`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const addBook = async (newBook: book): Promise<book> => {
  try {
    const response = await fetch(`https://localhost:5000/Book/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      // ✅ Check if response is NOT okay
      const errorMessage = await response.text(); // Get error message from server
      throw new Error(`Failed to add book: ${errorMessage}`);
    }

    return await response.json();
  } catch {
    console.error('error adding project');
    throw Error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: book
): Promise<book> => {
  try {
    const response = await fetch(
      `https://localhost:5000/Book/UpdateBook/${bookId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      }
    );

    return await response.json();
  } catch (Error) {
    console.error('error man with updating');
    throw Error;
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(
      `https://localhost:5000/Book/DeleteBook/${bookId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (Error) {
    console.error('Error deleting book');
    throw Error;
  }
};
