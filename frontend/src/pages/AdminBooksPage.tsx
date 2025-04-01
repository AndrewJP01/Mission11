import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { book } from '../types/book';
import { deleteBook, fetchBooks } from '../api/BooksApi';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminBooksPage = () => {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [_totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<book | null>(null);

  // const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        console.log('📢 Fetching books...');
        const data = await fetchBooks(pageSize, pageNum, []);

        console.log('✅ API Response:', JSON.stringify(data, null, 2));

        if (data && data.books) {
          setBooks(data.books);
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
  }, [pageSize, pageNum, sortOrder]);

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(bookId);
      setBooks(books.filter((b) => b.bookId !== bookId));
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '1200px',
        margin: 'auto',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Admin - Books
      </h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNum, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(pageSize, pageNum, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : books.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No books found.</p>
      ) : (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  textAlign: 'left',
                }}
              >
                {[
                  'ID',
                  'Title',
                  'Author',
                  'Publisher',
                  'ISBN',
                  'Classification',
                  'Category',
                  'Page Count',
                  'Price',
                  'Actions',
                ].map((col) => (
                  <th
                    key={col}
                    style={{ padding: '10px', borderBottom: '2px solid #ddd' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {books.map((b, index) => (
                <tr
                  key={b.bookId}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                  }}
                >
                  {[
                    b.bookId,
                    b.title,
                    b.author,
                    b.publisher,
                    b.isbn,
                    b.cLassification,
                    b.category,
                    b.pageCount,
                    `$${b.price.toFixed(2)}`,
                  ].map((value, i) => (
                    <td
                      key={i}
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      {value}
                    </td>
                  ))}
                  <td
                    style={{ padding: '10px', borderBottom: '1px solid #ddd' }}
                  >
                    <button
                      style={{
                        marginRight: '5px',
                        padding: '5px 10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setEditingBook(b)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDelete(b.bookId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              disabled={pageNum === 1}
              onClick={() => setPageNum((prev) => prev - 1)}
              style={{ margin: '5px', padding: '8px 12px', cursor: 'pointer' }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPageNum(page)}
                disabled={pageNum === page}
                style={{
                  margin: '5px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontWeight: pageNum === page ? 'bold' : 'normal',
                }}
              >
                {page}
              </button>
            ))}

            <button
              disabled={pageNum === totalPages || totalPages === 0}
              onClick={() => setPageNum((prev) => prev + 1)}
              style={{ margin: '5px', padding: '8px 12px', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>

          {/* Page Size Selector */}
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <label>
              Results per page:{' '}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNum(1);
                }}
                style={{ padding: '5px', marginLeft: '5px' }}
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Sort Order Toggle */}
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{ padding: '8px 12px', cursor: 'pointer', margin: '10px' }}
            >
              Sort by Title ({sortOrder === 'asc' ? 'Z-A' : 'A-Z'})
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBooksPage;
