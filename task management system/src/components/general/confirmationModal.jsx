
export const ConfirmationModal = ({ 
  isOpen,
  loading,
  onClose, 
  onConfirm, 
  title, 
  message, 
  subMessage,
  smallSubMessage, 
  icon = "⚠️", 
  confirmText,
  cancelText,
  confirmBtnClass 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1060 // High z-index to stay on top
      }}
    >
      <div className="modal-dialog shadow-lg" style={{ maxWidth: '400px', width: '90%' }}>
        <div className="modal-content border-0">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-dark">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body py-4 text-center">
            <div className="mb-3">
              <span style={{ fontSize: '3rem' }}>{icon}</span>
            </div>
            <p className="mb-1 text-muted">{message}</p>
            <h5 className="fw-bold">{subMessage}</h5>
            <small className="text-secondary">
              {smallSubMessage && <span>{smallSubMessage}</span> 
              ||'This action cannot be undone.'}</small>
          </div>

          <div className="modal-footer border-0 pt-0 pb-4 d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-light px-4 fw-semibold me-2"
              onClick={onClose}
            >
              {cancelText || "Cancel"}
            </button>
            <button
              type="button"
              className={`btn ${confirmBtnClass} px-4 fw-semibold`}
              onClick={onConfirm}
              disabled={loading? true : false}
            >
              {confirmText || "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};