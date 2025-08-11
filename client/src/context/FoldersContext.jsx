// context/FoldersContext.jsx
import { createContext, useContext, useState } from "react";
import { useFoldersReducer } from "../hooks/useFolderReducer";

const FoldersContext = createContext();

export function FoldersProvider({ children }) {
  const { folders, fetchFolders, createFolder, deleteFolder } =
    useFoldersReducer();

  const [currentFolderId, setCurrentFolderId] = useState(null);

  return (
    <FoldersContext.Provider
      value={{
        folders,
        fetchFolders,
        createFolder,
        deleteFolder,
        currentFolderId,
        setCurrentFolderId,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  return useContext(FoldersContext);
}
