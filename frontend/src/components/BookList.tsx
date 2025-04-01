import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { book } from '../types/book';
import { fetchBooks } from '../api/BooksApi';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);

      try {
        console.log('📢 Fetching books...');
        const data = await fetchBooks(pageSize, pageNum, selectedCategories);
        console.log('✅ API Response:', JSON.stringify(data, null, 2));

        if (data && data.books) {
          // ✅ Fixed here
          setBooks(data.books); // ✅ Fixed here
          setTotalItems(data.totalNumBooks || 0);
          setTotalPages(Math.ceil((data.totalNumBooks || 1) / pageSize));
        } else {
          console.error('❌ Invalid API response:', data);
          setBooks([]);
        }
      } catch (error) {
        console.error('❌ Error fetching books:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, selectedCategories]);

  return (
    <>
      <h2>Book List</h2>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        books.map((b) => (
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
                  <strong>Price: </strong>${b.price.toFixed(2)}
                </li>
              </ul>
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/purchase/${b.title}/${b.bookId}`, {
                    state: { price: b.price },
                  })
                }
              >
                Purchase
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div>
        <button
          disabled={pageNum === 1}
          onClick={() => setPageNum((prev) => prev - 1)}
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
          onClick={() => setPageNum((prev) => prev + 1)}
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
          onChange={(e) => {
            setPageSize(Number(e.target.value));
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
        Sort by Name ({sortOrder === 'asc' ? 'Z-A' : 'A-Z'})
      </button>
    </>
  );
}

export default BookList;
