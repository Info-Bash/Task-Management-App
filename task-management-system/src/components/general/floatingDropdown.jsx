import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

function ActionDropdown({
  isOpen,
  onToggle,
  onClose,
  onComplete,
  onView,
  onEdit,
  onDelete
}) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Close on click outside or scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleEvents = () => onClose();
    window.addEventListener("click", handleEvents);
    window.addEventListener("scroll", handleEvents, true); // Close on scroll for position safety
    return () => {
      window.removeEventListener("click", handleEvents);
      window.removeEventListener("scroll", handleEvents, true);
    };
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const padding = 8;
      const menuWidth = 180;
      // We estimate height or grab it if menuRef was rendered (using a small delay or estimate)
      const menuHeight = 160; 

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Vertical Logic: Open up if not enough space below
      const shouldOpenUp = rect.bottom + menuHeight > viewportHeight;
      
      // Horizontal Logic: Open left if not enough space on the right
      let leftPos = rect.right - menuWidth; // Default: align right edges
      if (leftPos < padding) {
        leftPos = rect.left; // Align left edges instead
      }
      // safety check: don't go off the right edge either
      if (leftPos + menuWidth > viewportWidth) {
        leftPos = viewportWidth - menuWidth - padding;
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      setPos({
        top: shouldOpenUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
        left: Math.max(padding, leftPos), // Never less than padding
      });
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={btnRef}
        className={`btn btn-sm rounded-circle ${isOpen ? 'btn-secondary' : 'btn-light border'}`}
        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>

      {isOpen && pos &&
        createPortal(
          <ul
            ref={menuRef}
            className="dropdown-menu show shadow-lg border-0 animate__animated animate__fadeIn animate__faster"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 10000, // Higher than any navigation
              minWidth: "180px",
              margin: 0,
              padding: '0.5rem 0'
            }}
          >
            {onView && (
              <li>
                <Link to={`/task/${onView}`} className="dropdown-item py-2 px-3">
                  <i className="bi bi-eye me-2"></i> View Task
                </Link>
              </li>
            )}

            {onEdit && (
              <li>
                <Link to={`/task/${onEdit}/edit`} className="dropdown-item py-2 px-3">
                  <i className="bi bi-pencil me-2"></i> Edit Task
                </Link>
              </li>
            )}

            {onComplete && (
              <li>
                <button className="dropdown-item py-2 px-3" onClick={onComplete}>
                  <i className="bi bi-check2-circle me-2"></i> Mark Completed
                </button>
              </li>
            )}

            {onDelete && (onView || onEdit || onComplete) && (
              <li><hr className="dropdown-divider opacity-50" /></li>
            )}

            {onDelete && (
              <li>
                <button className="dropdown-item py-2 px-3 text-danger" onClick={onDelete}>
                  <i className="bi bi-trash3 me-2"></i> Delete
                </button>
              </li>
            )}
          </ul>,
          document.body
        )}
    </>
  );
}

export default ActionDropdown;