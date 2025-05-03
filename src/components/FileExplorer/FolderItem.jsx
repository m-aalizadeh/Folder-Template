import React from "react";

const FolderItem = ({
  name,
  path,
  isExpanded,
  selected,
  children,
  onToggle,
  onSelect,
  onContextMenu,
  onAddFile,
  onAddFolder,
  onRename,
  onDelete,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onToggle();
    onSelect();
  };

  const handleContextMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e);
  };

  return (
    <div className="folder-container">
      <div
        className={`folder-item ${selected ? "selected" : ""}`}
        onClick={handleClick}
        onContextMenu={handleContextMenuClick}
      >
        <span>
          {isExpanded ? "📂" : "📁"} {name}
        </span>
        <div className="folder-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFile(path);
            }}
          >
            +File
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFolder(path);
            }}
          >
            +Folder
          </button>
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
      {isExpanded && <div className="folder-children">{children}</div>}
    </div>
  );
};

export default FolderItem;
