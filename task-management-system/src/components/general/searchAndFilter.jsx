
const FilterBar = ({
  search,
  setSearch,
  filterValue,
  setFilterValue,
  totalResults,
  setPage,
  options = [],
  activeFilterValue,
  setActiveFilterValue,
  activeOptions = [],
  placeholder = "Search..."
}) => {
  return (
    <div className="d-flex justify-content-center justify-content-md-end">
  <div 
    className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 bg-white p-3 p-md-2 rounded-3 shadow-sm border" 
    style={{ maxWidth: '700px', width: '100%' }}
  >
    
    {/* Search Input - Full width on mobile */}
    <div className="flex-grow-1">
      <div className="input-group input-group-sm">
        <span className="input-group-text bg-white border-end-0 text-muted">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0 py-2"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
    </div>

    {/* Stats and Filter Container */}
    <div className="d-flex flex-wrap align-items-center gap-2">
      {/* Results Count */}
      <div className="small text-dark fw-bold text-nowrap border-end pe-2">
        {totalResults} <span className="d-md-none d-lg-inline">Results</span>
      </div>

      {/* Selects Wrapper - Ensuring they sit side-by-side even on small screens */}
      <div className="d-flex gap-2 align-items-center flex-wrap">
        {/* Role filter */}
        <select
          className="form-select form-select-sm border-0 bg-light fw-semibold"
          style={{ width: 'auto', minWidth: '100px', cursor: 'pointer' }}
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setPage(1);
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Active status filter */}
        {activeFilterValue && (
          <select
            className="form-select form-select-sm border-0 bg-light fw-semibold"
            style={{ width: 'auto', minWidth: '100px', cursor: 'pointer' }}
            value={activeFilterValue}
            onChange={(e) => {
              setActiveFilterValue(e.target.value);
              setPage(1);
            }}
          >
            {activeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {/* Reset Button */}
        <button
          className="btn btn-sm btn-outline-secondary border-0 px-2"
          onClick={() => {
            setSearch('');
            setFilterValue(options?.[0]?.value || '');
            setActiveFilterValue?.(activeOptions?.[0]?.value || '');
            setPage(1);
          }}
          title="Reset Filters"
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default FilterBar;