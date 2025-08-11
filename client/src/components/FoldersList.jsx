import { Link } from "react-router-dom";
import { useFolders } from "../context/FoldersContext";
import { useState, useEffect } from "react";
import FolderItem from "./FolderItem";

export default function FoldersList() {
  const {
    folders,
    currentFolderId,
    setCurrentFolderId,
    fetchFolders,
    createFolder,
  } = useFolders();

  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }
    setError("");
    try {
      await createFolder(newFolderName.trim());
      setNewFolderName("");
      setCreating(false);
    } catch (err) {
      setError(err.message || "Failed to create folder");
    }
  };

  return (
    <nav className="flex flex-col flex-1 overflow-y-auto">
      <ul className="space-y-2 mt-4 p-2 flex-1">
        <li>
          <Link
            to="/"
            className="text-gray-300 pl-3 font-bold hover:underline"
            onClick={() => setCurrentFolderId(null)}
          >
            🏠 All Notes
          </Link>
        </li>
        {folders.map((folder) => (
          <FolderItem key={folder._id} folder={folder} />
        ))}
      </ul>

      <div className="p-2 border-t border-gray-700">
        {creating ? (
          <>
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") {
                  setCreating(false);
                  setNewFolderName("");
                  setError("");
                }
              }}
              placeholder="New folder name"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-lime-300"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="flex justify-end space-x-2 mt-2">
              <button
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                onClick={handleCreateFolder}
              >
                Create
              </button>
              <button
                className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                onClick={() => {
                  setCreating(false);
                  setNewFolderName("");
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            className="w-full py-2 text-left text-lime-400 hover:text-lime-300 font-bold"
            onClick={() => setCreating(true)}
          >
            + Create Folder
          </button>
        )}
      </div>
    </nav>
  );
}
