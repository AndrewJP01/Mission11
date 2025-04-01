import { useState } from 'react';
import { book } from '../types/book';
import { updateBook } from '../api/BooksApi';

interface EditBookFormProps {
  book: book;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState<book>({ ...book });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook(formData.bookId, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Book</h2>

      <label>
        Book Title:{' '}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Author:{' '}
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Publisher:{' '}
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        ISBN:{' '}
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Classification:{' '}
        <input
          type="text"
          name="cLassification"
          value={formData.cLassification}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Category:{' '}
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Page Count:{' '}
        <input
          type="number"
          name="pageCount"
          value={formData.pageCount}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Price:{' '}
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Edit Book</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditBookForm;
