import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

function ActionDropdown({
  isOpen,
  onToggle,
  onClose,
  onComplete, // Optional callback
  onView, // Optional callback
  onEdit, // Optional callback
  onDelete // Optional callback
}) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = () => onClose();
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const menuHeight = 160;
      const menuWidth = 180;
      const spaceBelow = window.innerHeight - rect.bottom;

      const shouldOpenUp = spaceBelow < menuHeight;

      setPos({
        top: shouldOpenUp ? rect.top - menuHeight - 6 : rect.bottom + 6,
        left: rect.right - menuWidth,
      });
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={btnRef}
        className={`btn btn-sm ${isOpen ? 'btn-secondary' : 'btn-light'}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        ⋮
      </button>

      {isOpen && pos &&
        createPortal(
          <ul
            className="dropdown-menu show shadow-lg"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
              minWidth: "180px",
              margin: 0
            }}
          >

            {onView && (
              <li>
                <Link
                  to={`/view-task/${onView}`}
                  className="dropdown-item text-decoration-none"
                >
                  View Task
                </Link>
              </li>
            )}

            {onEdit && (
              <li><button className="dropdown-item" onClick={onEdit}>Edit Task</button></li>
            )}

            {onComplete && (
              <li><button className="dropdown-item" onClick={onComplete}>Mark Completed</button></li>
            )}

            {onDelete && (onView || onEdit || onComplete) && (
              <li><hr className="dropdown-divider" /></li>
            )}

            {onDelete && (
              <li><button className="dropdown-item text-danger" onClick={onDelete}>Delete</button></li>
            )}
          </ul>,
          document.body
        )}
    </>
  );
}

export default ActionDropdown;