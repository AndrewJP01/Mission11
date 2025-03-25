import { useEffect, useState } from 'react';
import { Book } from './types/book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Track sorting order

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}`
        );
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        // Apply sorting before setting the books state
        const sortedBooks = [...data.books].sort((a, b) =>
          sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        );

        setBooks(sortedBooks);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder]);

  return (
    <>
      <h1>My Books</h1>

      {books.map((b) => (
        <div id="bookCard" className="card" key={b.bookId}>
          <h3>{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Author: </strong>
                {b.author}
              </li>
              <li>
                <strong>Publisher: </strong>
                {b.publisher}
              </li>
              <li>
                <strong>ISBN: </strong>
                {b.isbn}
              </li>
              <li>
                <strong>Classification: </strong>
                {b.cLassification}
              </li>
              <li>
                <strong>Category: </strong>
                {b.category}
              </li>
              <li>
                <strong>Page Count: </strong>
                {b.pageCount}
              </li>
              <li>
                <strong>Price: </strong>
                {b.price}
              </li>
            </ul>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div>
        <button
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPageNum(i + 1)}
            disabled={pageNum === i + 1}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={pageNum === totalPages || totalPages === 0}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>

      {/* Page Size Selector */}
      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>

      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        Sort by Project Name ({sortOrder === 'asc' ? 'Z-A' : 'A-Z'})
      </button>
    </>
  );
}

export default BookList;
