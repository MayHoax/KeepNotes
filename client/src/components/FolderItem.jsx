import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useFolders } from "../context/FoldersContext";
import ConfirmModal from "./ConfirmModal";

export default function FolderItem({ folder }) {
  const { currentFolderId, setCurrentFolderId, deleteFolder } = useFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteFolder(folder._id);
      if (currentFolderId === folder._id) {
        setCurrentFolderId(null);
      }
    } catch (err) {
      alert("Failed to delete folder: " + err.message);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <li className="flex justify-between items-center">
        <NavLink
          to={`/${folder._id}`}
          className={({ isActive }) =>
            `pl-3 font-mono text-xl font-bold hover:underline active:text-lime-300 ${
              currentFolderId === folder._id || isActive
                ? "text-white"
                : "text-gray-400"
            }`
          }
          onClick={() => setCurrentFolderId(folder._id)}
        >
          {folder.name}
        </NavLink>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          aria-label={`Delete folder ${folder.name}`}
          className="text-red-500 hover:text-red-700 px-2"
          title="Delete folder"
        >
          🗑️
        </button>
      </li>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Folder"
        message={`Are you sure you want to delete "${folder.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
