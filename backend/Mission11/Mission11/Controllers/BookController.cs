using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11.Data;

namespace Mission11.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? bookCategory = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (bookCategory != null && bookCategory.Any())
            {
                query = query.Where(p => bookCategory.Contains(p.Category));
            }

            var totalNumBooks = query.Count();

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            

            var someObject = new
            {
                Books = something,
                totalNumBooks = totalNumBooks
            };

            return Ok(someObject);
        }

        [HttpGet("GetBookCategory")]
        public IActionResult GetBookCategory() 
        { 
            var bookCategory = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategory);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook) 
        { 
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);

        }

        [HttpPut("updateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Category = updatedBook.Category;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.CLassification = updatedBook.CLassification;
            existingBook.Price = updatedBook.Price;
            existingBook.PageCount = updatedBook.PageCount;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();
            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId) 
        { 
            var book = _bookContext.Books.Find(bookId);

            if (book == null) { 
                return NotFound();
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }


    }
}
