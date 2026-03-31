
function Pagination({ page, setPage, totalPages }) {
  const getPaginationRange = (current, total) => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <nav>
      <ul className="pagination mb-0">
        {/* Previous Button */}
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link shadow-sm mx-1" onClick={() => setPage(p => p - 1)}>
            Prev
          </button>
        </li>

        {/* Dynamic Page Numbers */}
        {getPaginationRange(page, totalPages).map((p, index) => (
          <li key={index} className={`page-item ${p === page ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
            <button
              className={`page-link shadow-sm mx-1 ${p === page ? 'bg-primary text-white' : 'bg-white text-dark'}`}
              onClick={() => typeof p === 'number' && setPage(p)}
            >
              {p}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link shadow-sm mx-1 " onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination;