import React from "react";

const FileItem = ({
  name,
  path,
  selected,
  onSelect,
  onContextMenu,
  onRename,
  onDelete,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleContextMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e);
  };

  return (
    <div
      className={`file-item ${selected ? "selected" : ""}`}
      onClick={handleClick}
      onContextMenu={handleContextMenuClick}
    >
      <span>📄 {name}</span>
      <div className="file-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename(path);
          }}
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(path);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FileItem;
