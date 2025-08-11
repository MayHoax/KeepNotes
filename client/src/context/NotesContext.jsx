// context/NoteContext.jsx
import { createContext, useContext } from "react";
import { useNotesReducer } from "../hooks/useNotesReducer";

const NoteContext = createContext(null);

export function NoteProvider({ children }) {
  const {
    notes,
    fetchNotes,
    fetchNotesByFolder,
    createNote,
    updateNote,
    deleteNote,
  } = useNotesReducer();

  return (
    <NoteContext.Provider
      value={{
        notes,
        fetchNotes,
        fetchNotesByFolder,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export function useNoteContext() {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error("useNoteContext must be used within NoteProvider");
  return ctx;
}
