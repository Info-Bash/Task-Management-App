export function ViewTask({ task, onClose, onEdit, showEditButton = true }) {
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          
          {/* Header */}
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="text-uppercase text-muted small fw-bold tracking-wider">Task Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body pt-2 px-4">
            <h2 className="display-6 fw-bold mb-2 text-truncate" title={task.title}>
              {task.title}
            </h2>
            
            <hr className="my-3 opacity-10" />

            <div className="task-content">
              <label className="form-label text-primary fw-bold mb-2 small">DESCRIPTION</label>
              
              {/* Fixed Height Scroll Area */}
              <div 
                className="description-scroll-area p-3 bg-light rounded"
                style={{ 
                  height: '300px',        // Fixed height prevents "tall/short" jumping
                  overflowY: 'auto',      // Allows scrolling if text is long
                  whiteSpace: 'pre-wrap', 
                  lineHeight: '1.6',
                  wordBreak: 'break-word',
                  border: '1px solid #eee'
                }}
              >
                {task.desc ? (
                  <p className="text-dark mb-0">{task.desc}</p>
                ) : (
                  <p className="text-muted fst-italic">No description provided for this task.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top-0 pt-3 pb-4 px-4 d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
              Close
            </button>

            {/* Conditional Edit Button */}
            {showEditButton && (
              <button type="button" className="btn btn-primary px-4 shadow-sm" onClick={onEdit}>
                <i className="bi bi-pencil me-2"></i> Edit Task
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}