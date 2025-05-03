import React, { useState, useEffect } from "react";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import ContextMenu from "./ContextMenu";
import { findNode, sortChildren } from "../../utils/fileSystem";
import "./FileExplorer.css";

const FileExplorer = () => {
  const initialData = {
    name: "root",
    type: "folder",
    children: [
      {
        name: "src",
        type: "folder",
        children: [
          { name: "index.html", type: "file" },
          { name: "styles.css", type: "file" },
          {
            name: "components",
            type: "folder",
            children: [
              { name: "Header.js", type: "file" },
              { name: "Footer.js", type: "file" },
            ],
          },
        ],
      },
      {
        name: "public",
        type: "folder",
        children: [
          { name: "favicon.ico", type: "file" },
          { name: "index.html", type: "file" },
        ],
      },
      { name: "package.json", type: "file" },
      { name: "README.md", type: "file" },
    ],
  };

  const [data, setData] = useState(initialData);
  const [expandedFolders, setExpandedFolders] = useState(["root"]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPath, setCurrentPath] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    itemPath: null,
  });

  const handleContextMenu = (e, itemPath) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      itemPath,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  useEffect(() => {
    document.addEventListener("click", closeContextMenu);
    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  const addNode = (data, parentPath, newNode) => {
    const newData = JSON.parse(JSON.stringify(data));
    const parent = findNode(newData, parentPath.split("/"));

    if (!parent) return data;

    parent.children.push(newNode);
    parent.children = sortChildren(parent.children);

    return newData;
  };

  const deleteNode = (data, itemPath) => {
    const pathArray = itemPath.split("/");
    const itemName = pathArray.pop();
    const parentPath = pathArray.join("/");

    const newData = JSON.parse(JSON.stringify(data));
    const parent = findNode(newData, parentPath.split("/"));

    if (!parent) return data;

    parent.children = parent.children.filter(
      (child) => child.name !== itemName
    );
    return newData;
  };

  const renameNode = (data, itemPath, newName) => {
    const newData = JSON.parse(JSON.stringify(data));
    const node = findNode(newData, itemPath.split("/"));

    if (!node) return data;

    node.name = newName;

    const pathArray = itemPath.split("/");
    pathArray.pop();
    const parentPath = pathArray.join("/");

    if (parentPath) {
      const parent = findNode(newData, parentPath.split("/"));
      if (parent) {
        parent.children = sortChildren(parent.children);
      }
    }

    return newData;
  };

  const handleAddFile = (parentPath) => {
    const fileName = prompt("Enter file name:");
    if (!fileName) return;

    if (fileName.includes("/")) {
      const parts = fileName.split("/");
      const actualFileName = parts.pop();
      const folderPath = parts.join("/");
      handleAddFolder(`${parentPath}/${folderPath}`);
      parentPath = `${parentPath}/${folderPath}`;
    }

    const parentNode = findNode(data, parentPath.split("/"));
    if (parentNode.children.some((child) => child.name === fileName)) {
      alert("This file already exists!");
      return;
    }

    const newFile = { name: fileName, type: "file" };

    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const parent = findNode(newData, parentPath.split("/"));
      parent.children.push(newFile);

      parent.children.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "folder" ? -1 : 1;
      });
      return newData;
    });
  };

  const handleAddFolder = (parentPath) => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    if (folderName.includes("/")) {
      const parts = folderName.split("/");
      const actualFolderName = parts.pop();
      const folderPath = parts.join("/");
      handleAddFolder(`${parentPath}/${folderPath}`);
      parentPath = `${parentPath}/${folderPath}`;
    }

    const parentNode = findNode(data, parentPath.split("/"));
    if (parentNode.children.some((child) => child.name === folderName)) {
      alert("This folder already exists!");
      return;
    }

    const newFolder = { name: folderName, type: "folder", children: [] };

    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const parent = findNode(newData, parentPath.split("/"));
      parent.children.push(newFolder);
      parent.children.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "folder" ? -1 : 1;
      });
      return newData;
    });
  };

  const handleRename = (itemPath) => {
    const pathArray = itemPath.split("/");
    const itemName = pathArray.pop();
    const parentPath = pathArray.join("/");

    const newName = prompt("Enter new name:", itemName);
    if (!newName || newName === itemName) return;

    const parentNode = findNode(data, parentPath.split("/"));
    if (parentNode.children.some((child) => child.name === newName)) {
      alert("This name already exists!");
      return;
    }

    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const node = findNode(newData, itemPath.split("/"));
      node.name = newName;

      const parent = findNode(newData, parentPath.split("/"));
      parent.children.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "folder" ? -1 : 1;
      });
      return newData;
    });

    if (selectedItem === itemPath) {
      setCurrentPath(parentPath ? `${parentPath}/${newName}` : newName);
    }
  };

  const handleDelete = (itemPath) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const pathArray = itemPath.split("/");
    const itemName = pathArray.pop();
    const parentPath = pathArray.join("/");

    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const parent = findNode(newData, parentPath.split("/"));
      parent.children = parent.children.filter(
        (child) => child.name !== itemName
      );
      return newData;
    });

    if (selectedItem === itemPath || selectedItem.startsWith(`${itemPath}/`)) {
      setSelectedItem(null);
      setCurrentPath("");
    }
  };

  const toggleFolder = (folderPath) => {
    if (expandedFolders.includes(folderPath)) {
      setExpandedFolders(expandedFolders.filter((path) => path !== folderPath));
    } else {
      setExpandedFolders([...expandedFolders, folderPath]);
    }
  };

  const renderTree = (node, path = "") => {
    const currentPath = path ? `${path}/${node.name}` : node.name;

    if (node.type === "file") {
      return (
        <FileItem
          key={currentPath}
          name={node.name}
          path={currentPath}
          selected={selectedItem === currentPath}
          onSelect={() => {
            setSelectedItem(currentPath);
            setCurrentPath(currentPath);
          }}
          onContextMenu={(e) => handleContextMenu(e, currentPath)}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      );
    } else if (node.type === "folder") {
      const isExpanded = expandedFolders.includes(currentPath);

      return (
        <FolderItem
          key={currentPath}
          name={node.name}
          path={currentPath}
          isExpanded={isExpanded}
          selected={selectedItem === currentPath}
          onToggle={() => toggleFolder(currentPath)}
          onSelect={() => {
            setSelectedItem(currentPath);
            setCurrentPath(currentPath);
          }}
          onContextMenu={(e) => handleContextMenu(e, currentPath)}
          onAddFile={handleAddFile}
          onAddFolder={handleAddFolder}
          onRename={handleRename}
          onDelete={handleDelete}
        >
          {isExpanded &&
            node.children.map((child) => renderTree(child, currentPath))}
        </FolderItem>
      );
    }
  };

  return (
    <div className="file-explorer">
      <div className="sidebar">{renderTree(data)}</div>
      <div className="content">
        <h3>Current Path:</h3>
        <p>{currentPath}</p>
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          itemPath={contextMenu.itemPath}
          isFolder={
            findNode(data, contextMenu.itemPath?.split("/"))?.type === "folder"
          }
          onAddFile={handleAddFile}
          onAddFolder={handleAddFolder}
          onRename={handleRename}
          onDelete={handleDelete}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default FileExplorer;
