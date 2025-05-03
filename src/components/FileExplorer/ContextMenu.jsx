import React from "react";

const ContextMenu = ({
  x,
  y,
  itemPath,
  isFolder,
  onAddFile,
  onAddFolder,
  onRename,
  onDelete,
  onClose,
}) => {
  const handleAction = (action) => (e) => {
    e.stopPropagation();
    action(itemPath);
    onClose();
  };

  return (
    <div
      className="context-menu"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {isFolder && (
        <>
          <div onClick={handleAction(onAddFile)}>Add File</div>
          <div onClick={handleAction(onAddFolder)}>Add Folder</div>
        </>
      )}
      <div onClick={handleAction(onRename)}>Rename</div>
      <div onClick={handleAction(onDelete)}>Delete</div>
    </div>
  );
};

export default ContextMenu;
