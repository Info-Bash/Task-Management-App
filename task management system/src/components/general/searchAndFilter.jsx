
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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 bg-white p-2 rounded-3 shadow-sm border" style={{ maxWidth: '650px', width: '100%' }}>

        {/* Search Input */}
        <div className="flex-grow-1" style={{ minWidth: '200px' }}>
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

        {/* Stats and Filter */}
        <div className="d-flex align-items-center gap-2">
          <span className="small text-dark fw-bold text-nowrap border-end pe-2">
            {totalResults} Results
          </span>
          <span className="small text-muted fw-bold text-nowrap d-none d-sm-inline">
            Filter by:
          </span>

          {/* Role filter */}
          <select
            className="form-select form-select-sm border-0 bg-light fw-semibold"
            style={{ width: 'auto', cursor: 'pointer' }}
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
          {activeFilterValue &&
            <select
              className="form-select form-select-sm border-0 bg-light fw-semibold"
              style={{ width: 'auto', cursor: 'pointer' }}
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
          }

          <button
            className="btn btn-sm btn-primary border-0 px-2"
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
  );
};

export default FilterBar;