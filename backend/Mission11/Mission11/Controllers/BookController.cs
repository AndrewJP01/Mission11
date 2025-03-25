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
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1)
        {
            var something = _bookContext.Books
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            var totalNumBooks = _bookContext.Books.Count();

            var someObject = new
            {
                Books = something,
                totalNumBooks = totalNumBooks
            };

            return Ok(someObject);
        }
    }
}
